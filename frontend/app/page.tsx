'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { runWorkflow, type RunWorkflowRequest } from '@/lib/api';
import { ArrowUp, ArrowDown, Play, Loader2, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { WorkflowLoader } from '@/components/WorkflowLoader';
import { WarmupLoader } from '@/components/WarmupLoader';

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
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [isServerWarmed, setIsServerWarmed] = useState(true);

  // Check if server needs warming up on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const warmed = sessionStorage.getItem('serverWarmedUp') === 'true';
      setIsServerWarmed(warmed);
    }
  }, []);

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
      setIsWarmingUp(false);
      setIsServerWarmed(true);
      setOutputs(data.workflowRun.outputs);
      toast.success('Workflow completed successfully! 🎉', {
        description: `Processed ${data.workflowRun.outputs.length} steps`,
      });
    },
    onError: (error) => {
      setIsWarmingUp(false);
      toast.error('Workflow failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    },
  });

  const handleRun = () => {
    if (!inputText.trim() || steps.length < 2) return;
    setOutputs([]);

    // Show warmup loader if server hasn't been warmed up yet
    if (!isServerWarmed) {
      setIsWarmingUp(true);
    }

    mutation.mutate({ inputText, steps });
  };

  return (
    <>
      {isWarmingUp && <WarmupLoader />}
      {mutation.isPending && !isWarmingUp && <WorkflowLoader />}
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">AI-Powered Workflow Automation</span>
          </div>
          <h1 className="text-5xl font-bold font-outfit bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Workflow Builder
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Create intelligent workflows with 2-4 steps and watch AI transform your text in real-time
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-black border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 shadow-xl shadow-yellow-500/5">
            <CardHeader>
              <CardTitle className="font-montserrat text-xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Input Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your text here to begin the transformation..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                className="bg-black/50 border-yellow-500/20 focus:border-yellow-500/60 text-gray-100 placeholder:text-gray-600 resize-none rounded-lg backdrop-blur-sm"
              />
            </CardContent>
          </Card>

          {/* Workflow Steps Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-black border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 shadow-xl shadow-yellow-500/5">
            <CardHeader>
              <CardTitle className="font-montserrat text-xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Workflow Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={`${step}-${index}`}
                    className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 p-4 hover:border-yellow-500/40 transition-all group"
                  >
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold border-0 shadow-lg shadow-yellow-500/20">
                      {index + 1}
                    </Badge>
                    <span className="flex-1 text-sm font-medium text-gray-200 group-hover:text-yellow-400 transition-colors">
                      {STEP_LABELS[step]}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === steps.length - 1}
                        className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(index)}
                        disabled={steps.length <= 2}
                        className="h-8 w-8 p-0 text-yellow-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {steps.length < 4 && (
                <div className="space-y-3 pt-2 border-t border-yellow-500/10">
                  <p className="text-sm text-gray-500 font-medium">Add more steps:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSteps
                      .filter((s) => !steps.includes(s))
                      .map((step) => (
                        <Button
                          key={step}
                          variant="outline"
                          size="sm"
                          onClick={() => addStep(step)}
                          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60 hover:text-yellow-300 transition-all"
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
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 h-12"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Run Workflow
                  </>
                )}
              </Button>

              {mutation.isError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 backdrop-blur-sm">
                  <strong className="font-semibold">Error:</strong>{' '}
                  {mutation.error instanceof Error ? mutation.error.message : 'Unknown error'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        {outputs.length > 0 && (
          <Card className="bg-gradient-to-br from-zinc-900 to-black border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
            <CardHeader>
              <CardTitle className="font-montserrat text-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Workflow Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {outputs.map((output, index) => (
                <div key={index} className="space-y-3 group">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold border-0 shadow-lg shadow-yellow-500/20">
                      {index + 1}
                    </Badge>
                    <span className="text-base font-semibold text-yellow-400 font-montserrat">
                      {STEP_LABELS[output.step]}
                    </span>
                  </div>
                  <div className="rounded-lg bg-black/50 border border-yellow-500/20 p-5 backdrop-blur-sm group-hover:border-yellow-500/40 transition-all">
                    <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm leading-relaxed">
                      {output.outputText}
                    </pre>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
