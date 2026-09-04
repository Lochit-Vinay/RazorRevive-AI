import { Router } from 'express';
import { getDashboardMetrics, getAuditLogs } from '../controllers/dashboard.controller';

const router = Router();

router.get('/metrics', getDashboardMetrics);
router.get('/audit-logs', getAuditLogs);

export default router;
