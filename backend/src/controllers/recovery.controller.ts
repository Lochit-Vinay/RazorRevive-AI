import { Request, Response } from 'express';
import { prisma } from '../db';
import { recoveryEngine } from '../services/recovery.service';

export const listCases = async (req: Request, res: Response) => {
  try {
    const cases = await prisma.recoveryCase.findMany({
      include: {
        payment: {
          include: {
            customer: true,
            failures: { orderBy: { createdAt: 'desc' }, take: 1 }
          }
        },
        aiDecisions: { orderBy: { createdAt: 'desc' }, take: 1 },
        guardrailEvaluations: { orderBy: { createdAt: 'desc' }, take: 1 },
        recoveryActions: { orderBy: { executedAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
};

export const getCaseDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const caseDetails = await prisma.recoveryCase.findUnique({
      where: { id },
      include: {
        payment: {
          include: {
            customer: true,
            failures: true
          }
        },
        aiDecisions: { orderBy: { createdAt: 'desc' } },
        guardrailEvaluations: { orderBy: { createdAt: 'desc' } },
        recoveryActions: { orderBy: { executedAt: 'desc' } },
        auditLogs: { orderBy: { createdAt: 'desc' } }
      }
    });
    
    if (!caseDetails) return res.status(404).json({ error: 'Not found' });
    res.json(caseDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch case details' });
  }
};

export const analyzeCase = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await recoveryEngine.processRecoveryCase(id, false); // false = DO NOT auto-execute
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to process case' });
  }
};

export const executeCase = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const idempotencyKey = req.body.idempotencyKey as string;
    await recoveryEngine.executeRecoveryCase(id, idempotencyKey);
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to execute case' });
  }
};

export const runBatchSimulation = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({ take: 15 });
    if (customers.length === 0) return res.status(400).json({ error: 'No customers found to simulate' });

    const failureReasons = [
      'temporary_network_failure',
      'insufficient_funds',
      'bank_decline',
      'expired_card',
      'invalid_payment_method',
      'timeout'
    ];

    let created = 0;
    for (let i = 0; i < 15; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      // Mix of normal and high value amounts to trigger guardrails
      const amount = Math.random() > 0.8 ? Math.floor(Math.random() * 50000) + 55000 : Math.floor(Math.random() * 10000) + 500;
      const reason = failureReasons[Math.floor(Math.random() * failureReasons.length)];

      const payment = await prisma.payment.create({
        data: {
          customerId: customer.id,
          amount,
          status: 'FAILED',
          paymentMethod: ['CARD', 'UPI', 'NETBANKING'][Math.floor(Math.random() * 3)],
          failures: {
            create: { reason }
          }
        },
      });

      const caseData = await prisma.recoveryCase.create({
        data: {
          paymentId: payment.id,
          status: 'PENDING',
          revenueAtRisk: amount,
        }
      });

      await prisma.customer.update({
        where: { id: customer.id },
        data: { failureCount: { increment: 1 } }
      });

      // Process without auto-executing so they stay pending
      await recoveryEngine.processRecoveryCase(caseData.id, false);
      created++;
    }
    
    res.json({ success: true, processed: created, message: `Simulation completed — ${created} new recovery cases created` });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed batch simulation' });
  }
};

export const escalateApprove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        
        await prisma.recoveryCase.update({
            where: { id },
            data: { status: 'PENDING' } // Allow retry processing
        });

        // Update the blocking guardrail to ALLOWED
        const latestGuardrail = await prisma.guardrailEvaluation.findFirst({
            where: { recoveryCaseId: id },
            orderBy: { createdAt: 'desc' }
        });

        if (latestGuardrail) {
            await prisma.guardrailEvaluation.update({
                where: { id: latestGuardrail.id },
                data: { status: 'ALLOWED' }
            });
        }

        await prisma.auditLog.create({
          data: {
            recoveryCaseId: id,
            eventType: 'HUMAN_APPROVED',
            actor: 'HUMAN',
            metadata: JSON.stringify({ action: 'Approved escalation' })
          }
        });
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({error: 'Failed to approve'});
    }
}
