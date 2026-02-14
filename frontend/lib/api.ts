const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface WorkflowRun {
  id: string;
  inputText: string;
  steps: string[];
  outputs: Array<{
    step: string;
    outputText: string;
  }>;
  createdAt: string;
}

export interface RunWorkflowRequest {
  inputText: string;
  steps: string[];
}

export interface RunWorkflowResponse {
  success: boolean;
  workflowRun: WorkflowRun;
}

export interface HistoryResponse {
  success: boolean;
  runs: WorkflowRun[];
}

export interface HealthResponse {
  status: string;
  backend: string;
  database: string;
  llm: string;
  llmError?: string;
}

export const runWorkflow = async (
  data: RunWorkflowRequest
): Promise<RunWorkflowResponse> => {
  const response = await fetch(`${API_URL}/api/workflow/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run workflow');
  }

  return response.json();
};

export const getHistory = async (): Promise<HistoryResponse> => {
  const response = await fetch(`${API_URL}/api/workflow/history`);

  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }

  return response.json();
};

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error('Failed to fetch health');
  }

  return response.json();
};
