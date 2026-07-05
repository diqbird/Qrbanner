'use client';

import { Card, CardContent } from '@/components/ui/card';
import { QrCode, TrendingUp, Eye, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

type DashboardStatsCardsProps = {
  total: number;
  totalScans: number;
  active: number;
};

export function DashboardStatsCards({ total, totalScans, active }: DashboardStatsCardsProps) {
  const { t } = useLanguage();

  const items: { label: string; value: number; icon: LucideIcon; color: string }[] = [
    { label: t('dashboard.totalQrCodes'), value: total, icon: QrCode, color: 'text-primary' },
    { label: t('dashboard.totalScans'), value: totalScans, icon: TrendingUp, color: 'text-green-500' },
    { label: t('dashboard.activeCodes'), value: active, icon: Eye, color: 'text-blue-500' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
