import express from 'express';
import cors from 'cors';
import workflowRoutes from './routes/workflowRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/workflow', workflowRoutes);
app.use('/api/health', healthRoutes);

app.use(errorHandler);

export default app;
