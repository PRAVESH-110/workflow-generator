'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getHistory } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const STEP_LABELS: Record<string, string> = {
  clean_text: 'Clean Text',
  summarize: 'Summarize',
  extract_key_points: 'Extract Key Points',
  tag_category: 'Tag Category',
};

export default function HistoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-800">
        Error loading history: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const runs = data?.runs || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-200">Run History</h1>
        <p className="mt-2 text-gray-200">Last 5 workflow runs</p>
      </div>

      {runs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-200">
            No workflow runs yet. Run a workflow from the builder page.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => (
            <Card key={run.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Run from {new Date(run.createdAt).toLocaleString()}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-black">Input:</h3>
                  <div className="mt-1 rounded-md border border-gray-200 text-black bg-gray-50 p-3 text-sm">
                    {run.inputText}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Steps:</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {run.steps.map((step, idx) => (
                      <Badge key={idx} variant="default">
                        {idx + 1}. {STEP_LABELS[step]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-black">Outputs:</h3>
                  <div className="mt-2 space-y-3">
                    {run.outputs.map((output, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{idx + 1}</Badge>
                          <span className="text-sm font-medium">
                            {STEP_LABELS[output.step]}
                          </span>
                        </div>
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-black">
                          <pre className="whitespace-pre-wrap font-sans">
                            {output.outputText}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
