import { Router } from 'express';
import { listCases, getCaseDetails, analyzeCase, runBatchSimulation, escalateApprove, executeCase } from '../controllers/recovery.controller';

const router = Router();

router.get('/cases', listCases);
router.get('/cases/:id', getCaseDetails);
router.post('/analyze/:id', analyzeCase);
router.post('/execute/:id', executeCase);
router.post('/cases/:id/approve', escalateApprove);
router.post('/simulation/run', runBatchSimulation);

export default router;
