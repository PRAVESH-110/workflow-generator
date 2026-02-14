'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { runWorkflow, type RunWorkflowRequest } from '@/lib/api';
import { ArrowUp, ArrowDown, Play, Loader2 } from 'lucide-react';

const STEP_LABELS: Record<string, string> = {
  clean_text: 'Clean Text',
  summarize: 'Summarize',
  extract_key_points: 'Extract Key Points',
  tag_category: 'Tag Category',
};

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [steps, setSteps] = useState<string[]>(['clean_text', 'summarize']);
  const [outputs, setOutputs] = useState<
    Array<{ step: string; outputText: string }>
  >([]);

  const availableSteps = [
    'clean_text',
    'summarize',
    'extract_key_points',
    'tag_category',
  ];

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ];
    setSteps(newSteps);
  };

  const addStep = (step: string) => {
    if (steps.length >= 4) return;
    if (steps.includes(step)) return;
    setSteps([...steps, step]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 2) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: (data: RunWorkflowRequest) => runWorkflow(data),
    onSuccess: (data) => {
      setOutputs(data.workflowRun.outputs);
    },
  });

  const handleRun = () => {
    if (!inputText.trim() || steps.length < 2) return;
    setOutputs([]);
    mutation.mutate({ inputText, steps });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Workflow Builder</h1>
        <p className="mt-2 text-gray-600">
          Build a workflow with 2-4 steps and run it on your text
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={`${step}-${index}`}
                  className="flex items-center gap-2 rounded-md border border-gray-200 p-3"
                >
                  <Badge variant="default">{index + 1}</Badge>
                  <span className="flex-1 text-sm font-medium">
                    {STEP_LABELS[step]}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                      disabled={steps.length <= 2}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {steps.length < 4 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Add step:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSteps
                    .filter((s) => !steps.includes(s))
                    .map((step) => (
                      <Button
                        key={step}
                        variant="outline"
                        size="sm"
                        onClick={() => addStep(step)}
                      >
                        + {STEP_LABELS[step]}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleRun}
              disabled={!inputText.trim() || steps.length < 2 || mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Workflow
                </>
              )}
            </Button>

            {mutation.isError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                Error: {mutation.error instanceof Error ? mutation.error.message : 'Unknown error'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {outputs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {outputs.map((output, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <span className="text-sm font-medium">
                    {STEP_LABELS[output.step]}
                  </span>
                </div>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
                  <pre className="whitespace-pre-wrap font-sans">
                    {output.outputText}
                  </pre>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
