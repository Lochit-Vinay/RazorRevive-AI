import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { listCases, getCaseDetails, analyzeCase, runBatchSimulation, escalateApprove, executeCase } from '../controllers/recovery.controller';

const router = Router();

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many analysis requests from this IP, please try again later.' }
});

const executeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 execute requests per windowMs
  message: { error: 'Too many execute requests from this IP, please try again later.' }
});

router.get('/cases', listCases);
router.get('/cases/:id', getCaseDetails);
router.post('/analyze/:id', analyzeLimiter, analyzeCase);
router.post('/execute/:id', executeLimiter, executeCase);
router.post('/cases/:id/approve', escalateApprove);
router.post('/simulation/run', runBatchSimulation);

export default router;
