import { Request, Response } from 'express';
import { WorkflowRun } from '../models/WorkflowRun.js';
import { runStep } from '../services/llmService.js';

const VALID_STEPS = ['clean_text', 'summarize', 'extract_key_points', 'tag_category'];

export const runWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { inputText, steps } = req.body;

    if (!inputText || typeof inputText !== 'string') {
      res.status(400).json({ error: 'inputText is required and must be a string' });
      return;
    }

    if (!Array.isArray(steps) || steps.length < 2 || steps.length > 4) {
      res.status(400).json({ error: 'steps must be an array with 2-4 items' });
      return;
    }

    const invalidSteps = steps.filter((s) => !VALID_STEPS.includes(s));
    if (invalidSteps.length > 0) {
      res.status(400).json({ error: `Invalid steps: ${invalidSteps.join(', ')}` });
      return;
    }

    const outputs: Array<{ step: string; outputText: string }> = [];
    let currentText = inputText;

    for (const step of steps) {
      try {
        const outputText = await runStep(step, currentText);
        outputs.push({ step, outputText });
        currentText = outputText;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        outputs.push({ step, outputText: `Error: ${errorMessage}` });
        break;
      }
    }

    const workflowRun = new WorkflowRun({
      inputText,
      steps,
      outputs,
      createdAt: new Date(),
    });

    await workflowRun.save();

    const totalRuns = await WorkflowRun.countDocuments();
    if (totalRuns > 5) {
      const oldestRuns = await WorkflowRun.find()
        .sort({ createdAt: 1 })
        .limit(totalRuns - 5);
      await WorkflowRun.deleteMany({
        _id: { $in: oldestRuns.map((r) => r._id) },
      });
    }

    res.json({
      success: true,
      workflowRun: {
        id: workflowRun._id,
        inputText: workflowRun.inputText,
        steps: workflowRun.steps,
        outputs: workflowRun.outputs,
        createdAt: workflowRun.createdAt,
      },
    });
  } catch (error) {
    console.error('Workflow run error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const runs = await WorkflowRun.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      runs: runs.map((run) => ({
        id: run._id,
        inputText: run.inputText,
        steps: run.steps,
        outputs: run.outputs,
        createdAt: run.createdAt,
      })),
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
