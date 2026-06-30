'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import type { OptimizationInsight } from '@/lib/optimization-insights';

export function OptimizationInsightsPanel({ insights }: { insights: OptimizationInsight[] }) {
  if (!insights.length) return null;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" /> Optimization Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((i) => (
          <div
            key={i.id}
            className={`rounded-lg border p-3 text-sm ${
              i.severity === 'warning' ? 'border-amber-500/40 bg-amber-500/5' : i.severity === 'success' ? 'border-green-500/40 bg-green-500/5' : ''
            }`}
          >
            <p className="font-medium">{i.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{i.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
