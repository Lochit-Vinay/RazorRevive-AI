import { Request, Response } from 'express';
import { prisma } from '../db';

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    // Total Revenue at Risk (Pending & Escalated cases)
    const casesAtRisk = await prisma.recoveryCase.findMany({
      where: { status: { in: ['PENDING', 'ESCALATED'] } }
    });
    const revenueAtRisk = casesAtRisk.reduce((acc, c) => acc + c.revenueAtRisk, 0);

    // Total Recovered
    const recoveredCases = await prisma.recoveryCase.findMany({
      where: { status: 'RECOVERED' }
    });
    const revenueRecovered = recoveredCases.reduce((acc, c) => acc + c.revenueAtRisk, 0);

    // Total Actions attempted
    const recoveryAttempts = await prisma.recoveryAction.count();

    // Successful Recoveries count
    const successfulRecoveries = recoveredCases.length;

    // Escalations
    const escalations = await prisma.recoveryCase.count({
      where: { status: 'ESCALATED' }
    });

    // Guardrail Blocks
    const guardrailBlocks = await prisma.guardrailEvaluation.count({
      where: { status: 'BLOCKED' }
    });

    const recoveryRate = revenueAtRisk + revenueRecovered > 0 
      ? (revenueRecovered / (revenueAtRisk + revenueRecovered)) * 100 
      : 0;

    res.json({
      revenueAtRisk,
      revenueRecovered,
      recoveryRate,
      recoveryAttempts,
      successfulRecoveries,
      escalations,
      guardrailBlocks,
      totalCases: await prisma.recoveryCase.count()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};
