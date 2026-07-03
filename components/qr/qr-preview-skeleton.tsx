'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function QRPreviewSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="h-5 w-32 rounded bg-muted" />
      </CardHeader>
      <CardContent className="flex min-h-[280px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </CardContent>
    </Card>
  );
}
