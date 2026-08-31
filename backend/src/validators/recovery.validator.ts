import { z } from 'zod';

export const executeRecoverySchema = z.object({
  body: z.object({
    idempotencyKey: z.string().min(1, 'idempotencyKey cannot be empty')
  })
});

export const metricsQuerySchema = z.object({
  query: z.object({
    range: z.enum(['24h', '7d', '30d', 'all']).optional().default('all')
  })
});

export const caseIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Case ID cannot be empty')
  })
});
