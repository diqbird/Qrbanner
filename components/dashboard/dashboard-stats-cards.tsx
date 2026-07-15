'use client';

import { Card, CardContent } from '@/components/ui/card';
import { QrCode, TrendingUp, Eye, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';

type DashboardStatsCardsProps = {
  total: number;
  totalScans: number;
  active: number;
};

export function DashboardStatsCards({ total, totalScans, active }: DashboardStatsCardsProps) {
  const { t, locale } = useLanguage();

  const items: { label: string; value: number; icon: LucideIcon; color: string }[] = [
    { label: t('dashboard.totalQrCodes'), value: total, icon: QrCode, color: 'text-primary' },
    { label: t('dashboard.totalScans'), value: totalScans, icon: TrendingUp, color: 'text-green-500' },
    { label: t('dashboard.activeCodes'), value: active, icon: Eye, color: 'text-blue-500' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((stat) => (
        <Card
          key={stat.label}
          className="surface-3d border-white/30 bg-card/80 backdrop-blur-md transition-transform hover:-translate-y-0.5 dark:border-white/10"
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted/80 shadow-[0_10px_22px_-14px_rgba(0,0,0,0.45)] ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="font-display text-2xl font-bold">{formatLocaleNumber(stat.value, locale)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
