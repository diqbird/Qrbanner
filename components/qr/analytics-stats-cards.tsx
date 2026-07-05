'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BarChart3, Clock, TrendingUp, Users } from 'lucide-react';
import { PeriodChangeBadge } from '@/components/analytics/period-change-badge';
import type { QrAnalyticsState } from '@/hooks/use-qr-analytics';

type AnalyticsStatsCardsProps = {
  analytics: QrAnalyticsState;
};

export function AnalyticsStatsCards({ analytics }: AnalyticsStatsCardsProps) {
  const { t, data, periodComparison } = analytics;

  const stats = [
    {
      label: t('analytics.totalScans'),
      value: data?.totalScans ?? 0,
      icon: TrendingUp,
      color: 'text-primary',
      changePct: periodComparison?.totalScans.changePct,
    },
    {
      label: t('analytics.uniqueVisitors'),
      value: data?.uniqueScans ?? 0,
      icon: Users,
      color: 'text-violet-500',
      changePct: periodComparison?.uniqueScans.changePct,
    },
    {
      label: t('analytics.today'),
      value: data?.todayScans ?? 0,
      icon: Clock,
      color: 'text-orange-500',
    },
    {
      label: t('analytics.last7Days'),
      value: data?.last7Days ?? 0,
      icon: BarChart3,
      color: 'text-green-500',
    },
  ];

  return (
    <>
      {periodComparison?.totalScans.changePct !== null &&
      periodComparison?.totalScans.changePct !== undefined ? (
        <p className="text-xs text-muted-foreground">{t('analytics.vsPreviousPeriod')}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                    {'changePct' in stat ? <PeriodChangeBadge changePct={stat.changePct} /> : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
