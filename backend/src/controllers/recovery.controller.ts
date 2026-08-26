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
        aiDecisions: { orderBy: { createdAt: 'desc' }, take: 1 }
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
    await recoveryEngine.processRecoveryCase(id);
    res.json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to process case' });
  }
};

export const runBatchSimulation = async (req: Request, res: Response) => {
  try {
    const pendingCases = await prisma.recoveryCase.findMany({
      where: { status: 'PENDING' }
    });

    for (const c of pendingCases) {
      await recoveryEngine.processRecoveryCase(c.id);
    }
    
    res.json({ success: true, processed: pendingCases.length });
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
        await prisma.auditLog.create({
          data: {
            recoveryCaseId: id,
            eventType: 'HUMAN_APPROVED',
            actor: 'HUMAN',
            metadata: JSON.stringify({ action: 'Approved escalation for retry' })
          }
        });
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({error: 'Failed to approve'});
    }
}
