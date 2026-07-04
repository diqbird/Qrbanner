import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SettingsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}
