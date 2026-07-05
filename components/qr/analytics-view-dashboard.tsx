'use client';

import { LeadSubmissionsPanel } from './lead-submissions-panel';
import { LandingCtaAnalyticsPanel } from './landing-cta-analytics-panel';
import { AnalyticsRoiCard } from '@/components/analytics/analytics-roi-card';
import type { QrAnalyticsState } from '@/hooks/use-qr-analytics';
import { AnalyticsViewHeader } from './analytics-view-header';
import { AnalyticsStatsCards } from './analytics-stats-cards';
import { AnalyticsRecentScans } from './analytics-recent-scans';
import { AnalyticsViewRetentionBanner } from './analytics-view-retention-banner';
import { AnalyticsViewChartsSection } from './analytics-view-charts-section';

export function AnalyticsViewDashboard({
  qrId,
  analytics,
}: {
  qrId: string;
  analytics: QrAnalyticsState;
}) {
  const { retentionCutoff, planName, landingCta, roi, retry } = analytics;

  return (
    <div className="space-y-6">
      <AnalyticsViewHeader analytics={analytics} />

      {retentionCutoff && (
        <AnalyticsViewRetentionBanner retentionCutoff={retentionCutoff} planName={planName} />
      )}

      <AnalyticsStatsCards analytics={analytics} />

      <AnalyticsViewChartsSection analytics={analytics} />

      {roi && (
        <AnalyticsRoiCard
          qrId={qrId}
          data={roi}
          onSaved={() => {
            retry();
          }}
        />
      )}

      {landingCta && <LandingCtaAnalyticsPanel data={landingCta} />}

      <LeadSubmissionsPanel qrId={qrId} />

      <AnalyticsRecentScans analytics={analytics} />
    </div>
  );
}
