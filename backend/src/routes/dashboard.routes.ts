import { Router } from 'express';
import { getDashboardMetrics, getAuditLogs, getPerformanceMetrics } from '../controllers/dashboard.controller';

const router = Router();

router.get('/metrics', getDashboardMetrics);
router.get('/audit-logs', getAuditLogs);
router.get('/performance', getPerformanceMetrics);

export default router;
