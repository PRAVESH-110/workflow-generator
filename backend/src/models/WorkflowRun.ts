import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkflowRun extends Document {
  inputText: string;
  steps: string[];
  outputs: Array<{
    step: string;
    outputText: string;
  }>;
  createdAt: Date;
}

const WorkflowRunSchema = new Schema<IWorkflowRun>({
  inputText: { type: String, required: true },
  steps: { type: [String], required: true },
  outputs: {
    type: [
      {
        step: { type: String, required: true },
        outputText: { type: String, required: true },
      },
    ],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const WorkflowRun = mongoose.model<IWorkflowRun>(
  'WorkflowRun',
  WorkflowRunSchema
);
