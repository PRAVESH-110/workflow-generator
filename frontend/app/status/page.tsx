'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getHealth } from '@/lib/api';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function StatusPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 5000,
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-red-600">
            Failed to connect to backend: {error instanceof Error ? error.message : 'Unknown error'}
          </CardContent>
        </Card>
      </div>
    );
  }

  const health = data || {
    status: 'unknown',
    backend: 'unknown',
    database: 'unknown',
    llm: 'unknown',
  };

  const getStatusBadge = (status: string) => {
    if (status === 'running' || status === 'connected' || status === 'configured') {
      return <Badge variant="success">✓ {status}</Badge>;
    }
    return <Badge variant="error">✗ {status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
        <p className="mt-2 text-gray-600">Backend, database, and LLM health checks</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {health.backend === 'running' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Backend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(health.backend)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {health.database === 'connected' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(health.database)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {health.llm === 'configured' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              LLM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(health.llm)}
              {health.llmError && (
                <p className="text-xs text-red-600">{health.llmError}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
