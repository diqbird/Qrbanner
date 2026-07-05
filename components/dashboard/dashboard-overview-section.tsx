'use client';

import { DashboardAnalyticsPanel } from './dashboard-analytics';
import { OnboardingBanner } from './onboarding-banner';
import { OnboardingChecklist } from './onboarding-checklist';
import { PlanUpgradeBanner } from './plan-upgrade-banner';
import { PwaInstallBanner } from '@/components/pwa/pwa-install-banner';
import { TopQrWidget } from './top-qr-widget';
import { CampaignsPanel } from './campaigns-panel';
import { DashboardStatsCards } from './dashboard-stats-cards';
import { useLanguage } from '@/components/i18n/language-provider';
import type { useDashboardQrList } from '@/hooks/use-dashboard-qr-list';

type DashboardList = ReturnType<typeof useDashboardQrList>;

export function DashboardOverviewSection({ list }: { list: DashboardList }) {
  const { t } = useLanguage();

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <OnboardingBanner show={!list.loading && list.totals.accountQrCount === 0} />
      <OnboardingChecklist qrCount={list.totals.accountQrCount} />
      <PlanUpgradeBanner />
      <PwaInstallBanner />

      <DashboardStatsCards
        total={list.stats.total}
        totalScans={list.stats.totalScans}
        active={list.stats.active}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <TopQrWidget />
        <CampaignsPanel />
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight mb-4">{t('dashboard.analyticsOverview')}</h2>
        <DashboardAnalyticsPanel />
      </div>
    </>
  );
}
