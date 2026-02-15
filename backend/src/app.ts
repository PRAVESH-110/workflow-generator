import express from 'express';
import cors from 'cors';
import workflowRoutes from './routes/workflowRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());


const allowedOrigins = [
  "http://localhost:3000",
  "https://checkmysite.vercel.app",
  process.env.FRONTEND_URL // Add your production frontend URL here
].filter(Boolean); // Filter out undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use('/api/workflow', workflowRoutes);
app.use('/api/health', healthRoutes);

app.use(errorHandler);

export default app;
