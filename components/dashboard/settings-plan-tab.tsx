'use client';

import { PlanUsageCard } from '@/components/dashboard/plan-usage-card';

type SettingsPlanTabProps = {
  planRefresh: number;
};

export function SettingsPlanTab({ planRefresh }: SettingsPlanTabProps) {
  return <PlanUsageCard refreshKey={planRefresh} />;
}
