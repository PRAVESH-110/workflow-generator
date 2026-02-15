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

// Check if server needs warming up (first request in session)
const isServerWarmedUp = () => {
  if (typeof window === 'undefined') return true;
  return sessionStorage.getItem('serverWarmedUp') === 'true';
};

const markServerAsWarmed = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('serverWarmedUp', 'true');
};

export const runWorkflow = async (
  data: RunWorkflowRequest
): Promise<RunWorkflowResponse> => {
  const isWarmedUp = isServerWarmedUp();

  // Set a longer timeout for first request (cold start)
  const timeoutDuration = isWarmedUp ? 30000 : 90000; // 30s normal, 90s for cold start

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  try {
    const response = await fetch(`${API_URL}/api/workflow/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Mark server as warmed up after successful first request
    if (!isWarmedUp) {
      markServerAsWarmed();
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to run workflow');
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. The server may be starting up. Please try again in a moment.');
    }

    throw error;
  }
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
