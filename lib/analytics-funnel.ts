export type FunnelStageId = 'scans' | 'cta' | 'leads';

export type FunnelStage = {
  id: FunnelStageId;
  count: number;
  rateFromPrevious: number | null;
};

export type FunnelMetrics = {
  stages: FunnelStage[];
  overallConversion: number | null;
};

function rate(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round((current / previous) * 1000) / 10;
}

export function buildFunnelMetrics(opts: {
  scans: number;
  ctaClicks: number;
  leads: number;
  landingEnabled: boolean;
}): FunnelMetrics {
  const { scans, ctaClicks, leads, landingEnabled } = opts;

  const stages: FunnelStage[] = [{ id: 'scans', count: scans, rateFromPrevious: null }];

  if (landingEnabled || ctaClicks > 0) {
    stages.push({
      id: 'cta',
      count: ctaClicks,
      rateFromPrevious: rate(ctaClicks, scans),
    });
  }

  const prevForLeads = stages[stages.length - 1]?.count ?? scans;
  if (leads > 0 || landingEnabled) {
    stages.push({
      id: 'leads',
      count: leads,
      rateFromPrevious: rate(leads, prevForLeads),
    });
  }

  const last = stages[stages.length - 1];
  const overallConversion = scans > 0 && last ? rate(last.count, scans) : null;

  return { stages, overallConversion };
}
