import { Router } from 'express';
import { runWorkflow, getHistory } from '../controllers/workflowController.js';

const router = Router();

router.post('/run', runWorkflow);
router.get('/history', getHistory);

export default router;
