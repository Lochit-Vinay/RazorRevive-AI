export interface KPI {
  revenueAtRisk: number;
  revenueRecovered: number;
  recoveryRate: number;
  recoveryAttempts: number;
  escalations: number;
  successfulRecoveries: number;
  guardrailBlocks: number;
}

export interface FunnelData {
  failedPayments: number;
  eligibleCases: number;
  aiRecommendations: number;
  guardrailApproved: number;
  recoveryAttempted: number;
  recovered: number;
}

export interface FailureReason {
  reason: string;
  count: number;
  amount: number;
}

export interface TopCase {
  id: string;
  paymentId: string;
  revenueAtRisk: number;
  status: string;
  payment: {
    amount: number;
    customer: { name: string; email: string };
    failures: { reason: string }[];
  };
  aiDecisions: { recommendedAction: string }[];
}

export interface RecentActivity {
  id: string;
  eventType: string;
  actor: string;
  createdAt: string;
  recoveryCase?: {
    paymentId: string;
    payment: { amount: number };
  };
}

export interface DashboardMetrics {
  current: KPI;
  previous: KPI | null;
  funnel: FunnelData;
  failureReasons: FailureReason[];
  topCases: TopCase[];
  recentActivity: RecentActivity[];
  totalCases: number;
}
