'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BarChart3, Clock, TrendingUp, Users } from 'lucide-react';
import { PeriodChangeBadge } from '@/components/analytics/period-change-badge';
import type { DashboardAnalyticsState } from '@/hooks/use-dashboard-analytics';

type DashboardAnalyticsStatsProps = {
  analytics: DashboardAnalyticsState;
};

export function DashboardAnalyticsStats({ analytics }: DashboardAnalyticsStatsProps) {
  const { t, data, periodComparison } = analytics;
  if (!data) return null;

  const stats = [
    { label: t('analytics.today'), value: data.todayScans, icon: Clock, color: 'text-orange-500' },
    { label: t('analytics.last7Days'), value: data.last7Days, icon: TrendingUp, color: 'text-green-500' },
    {
      label: t('analytics.uniqueVisitors'),
      value: data.uniqueScans,
      icon: Users,
      color: 'text-violet-500',
      changePct: periodComparison?.uniqueScans.changePct,
    },
    {
      label: t('analytics.totalScans'),
      value: data.totalScans,
      icon: BarChart3,
      color: 'text-blue-500',
      changePct: periodComparison?.totalScans.changePct,
    },
  ];

  return (
    <>
      {periodComparison?.totalScans.changePct !== null &&
      periodComparison?.totalScans.changePct !== undefined ? (
        <p className="text-xs text-muted-foreground">{t('analytics.vsPreviousPeriod')}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-xl font-bold">{stat.value}</p>
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
