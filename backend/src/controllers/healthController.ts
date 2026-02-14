import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { checkLLMHealth } from '../services/llmService.js';

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const llmStatus = checkLLMHealth();

  res.json({
    status: 'ok',
    backend: 'running',
    database: dbStatus,
    llm: llmStatus.configured ? 'configured' : 'not_configured',
    llmError: llmStatus.error,
  });
};
