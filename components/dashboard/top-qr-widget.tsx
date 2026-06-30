'use client';

import Link from 'next/link';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/i18n/language-provider';
import { categoryShortName } from '@/lib/qr-utils';

interface TopQrItem {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  totalScans: number;
}

export function TopQrWidget({ items }: { items: TopQrItem[] }) {
  const { t } = useLanguage();
  const top = [...items]
    .filter((qr) => !qr.name.startsWith('__'))
    .sort((a, b) => b.totalScans - a.totalScans)
    .slice(0, 5);

  if (top.length === 0 || top.every((q) => q.totalScans === 0)) return null;

  const maxScans = top[0]?.totalScans || 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t('dashboard.topQrCodes')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {top.map((qr, index) => (
          <Link
            key={qr.id}
            href={`/qr/${qr.id}/analytics`}
            className="group flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border/60 hover:bg-muted/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium group-hover:text-primary">{qr.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {categoryShortName(qr.category)}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">/{qr.shortCode}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(8, Math.round((qr.totalScans / maxScans) * 100))}%` }}
                />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums">
              <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              {qr.totalScans.toLocaleString()}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
