import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
import { metricsQuerySchema } from '../validators/recovery.validator';

export const getDashboardMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = metricsQuerySchema.parse({ query: req.query });
    const range = query.range;
    
    const now = new Date();
    let currentStartDate: Date | null = null;
    let previousStartDate: Date | null = null;

    if (range === '24h') {
      currentStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      previousStartDate = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    } else if (range === '7d') {
      currentStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      currentStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    }

    const currentPeriodFilter = currentStartDate ? { createdAt: { gte: currentStartDate } } : {};
    const previousPeriodFilter = previousStartDate && currentStartDate 
      ? { createdAt: { gte: previousStartDate, lt: currentStartDate } } 
      : null;

    // Helper to get KPIs for a given period filter
    const getKPIs = async (filter: any) => {
      const cases = await prisma.recoveryCase.findMany({ where: filter });
      
      const actionFilter = filter.createdAt ? { executedAt: filter.createdAt } : {};
      const actionsCount = await prisma.recoveryAction.findMany({
        where: actionFilter,
        distinct: ['recoveryCaseId']
      });
      const escalations = cases.filter(c => c.status === 'ESCALATED').length;
      
      const guardrailBlocks = await prisma.guardrailEvaluation.findMany({
        where: { ...filter, status: 'BLOCKED' },
        distinct: ['recoveryCaseId']
      });
      
      let revenueAtRisk = 0;
      let revenueRecovered = 0;
      let successfulRecoveries = 0;

      cases.forEach(c => {
        if (c.status === 'PENDING' || c.status === 'ESCALATED') {
          revenueAtRisk += c.revenueAtRisk;
        } else if (c.status === 'RECOVERED') {
          revenueRecovered += c.revenueAtRisk;
          successfulRecoveries++;
        }
      });

      const recoveryRate = revenueAtRisk + revenueRecovered > 0 
        ? (revenueRecovered / (revenueAtRisk + revenueRecovered)) * 100 
        : 0;

      return { revenueAtRisk, revenueRecovered, recoveryRate, recoveryAttempts: actionsCount.length, escalations, successfulRecoveries, guardrailBlocks: guardrailBlocks.length };
    };

    const currentKPIs = await getKPIs(currentPeriodFilter);
    const previousKPIs = previousPeriodFilter ? await getKPIs(previousPeriodFilter) : null;

    // Funnel Data (for current period)
    const distinctAiRecommendations = await prisma.aiDecision.findMany({
      where: currentPeriodFilter,
      distinct: ['recoveryCaseId']
    });

    const distinctGuardrailApproved = await prisma.guardrailEvaluation.findMany({
      where: { ...currentPeriodFilter, status: 'ALLOWED' },
      distinct: ['recoveryCaseId']
    });

    const funnel = {
      failedPayments: await prisma.paymentFailure.count({ where: currentPeriodFilter }),
      eligibleCases: await prisma.recoveryCase.count({ where: currentPeriodFilter }),
      aiRecommendations: distinctAiRecommendations.length,
      guardrailApproved: distinctGuardrailApproved.length,
      recoveryAttempted: currentKPIs.recoveryAttempts,
      recovered: currentKPIs.successfulRecoveries
    };

    // Failure Reasons (for current period)
    const failures = await prisma.paymentFailure.findMany({
      where: currentPeriodFilter,
      include: { payment: true }
    });
    
    const failureReasonMap: Record<string, { count: number, amount: number }> = {};
    failures.forEach(f => {
      if (!failureReasonMap[f.reason]) failureReasonMap[f.reason] = { count: 0, amount: 0 };
      failureReasonMap[f.reason].count += 1;
      failureReasonMap[f.reason].amount += f.payment.amount;
    });

    const failureReasons = Object.entries(failureReasonMap)
      .map(([reason, data]) => ({ reason, ...data }))
      .sort((a, b) => b.amount - a.amount);

    // Top Cases (Pending, ordered by amount)
    const topCases = await prisma.recoveryCase.findMany({
      where: { status: 'PENDING' },
      orderBy: { revenueAtRisk: 'desc' },
      take: 5,
      include: {
        payment: { include: { customer: true, failures: { take: 1, orderBy: { createdAt: 'desc' } } } },
        aiDecisions: { take: 1, orderBy: { createdAt: 'desc' } }
      }
    });

    // Recent Activity
    const recentActivity = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        recoveryCase: { include: { payment: true } }
      }
    });

    res.json({
      current: currentKPIs,
      previous: previousKPIs,
      funnel,
      failureReasons,
      topCases,
      recentActivity,
      totalCases: await prisma.recoveryCase.count()
    });
  } catch (error) {
    next(error);
  }
};
