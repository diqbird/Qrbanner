export type RoiMetrics = {
  leadsCount: number;
  campaignCost: number | null;
  valuePerLead: number | null;
  estimatedRevenue: number | null;
  roi: number | null;
  hasInputs: boolean;
};

export function parseAnalyticsMoney(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) return null;
  return Math.round(n * 100) / 100;
}

export function buildRoiMetrics(opts: {
  leadsCount: number;
  campaignCost: number | null;
  valuePerLead: number | null;
}): RoiMetrics {
  const { leadsCount, campaignCost, valuePerLead } = opts;
  const hasInputs = campaignCost != null || valuePerLead != null;

  let estimatedRevenue: number | null = null;
  if (valuePerLead != null && leadsCount > 0) {
    estimatedRevenue = Math.round(valuePerLead * leadsCount * 100) / 100;
  } else if (valuePerLead != null) {
    estimatedRevenue = 0;
  }

  let roi: number | null = null;
  if (campaignCost != null && campaignCost > 0 && estimatedRevenue != null) {
    roi = Math.round(((estimatedRevenue - campaignCost) / campaignCost) * 1000) / 10;
  }

  return {
    leadsCount,
    campaignCost,
    valuePerLead,
    estimatedRevenue,
    roi,
    hasInputs,
  };
}
