import type { AnalyticsChartsData } from '@/lib/analytics-chart-constants';

export type NamedValue = { name: string; value: number };

export type AnalyticsDistributionData = {
  scansByDevice: NamedValue[];
  scansByBrowser: NamedValue[];
  scansByOS: NamedValue[];
  scansByCountry: NamedValue[];
  scansByCity: NamedValue[];
  scansBySource: NamedValue[];
  scansByHour: NamedValue[];
  scansByAbVariant: NamedValue[];
};

export function parseAnalyticsDistribution(data: AnalyticsChartsData): AnalyticsDistributionData {
  const scansByDevice = data?.scansByDevice ?? [];
  const scansByBrowser = data?.scansByBrowser ?? [];
  const scansByCountry = (data?.scansByCountry ?? []).filter((c) => c.name !== 'Unknown').slice(0, 10);
  const scansByCity = (data?.scansByCity ?? []).filter((c) => c.name !== 'Unknown').slice(0, 8);
  const scansBySource = (data?.scansBySource ?? []).filter((s) => s.name && s.name !== 'Unknown');
  const scansByOS = (data?.scansByOS ?? []).filter((s) => s.name && s.name !== 'Unknown');
  const scansByHour = data?.scansByHour ?? [];
  const scansByAbVariant = (data?.scansByAbVariant ?? []).filter((s) => s.name && s.name !== 'Unknown');

  return {
    scansByDevice,
    scansByBrowser,
    scansByOS,
    scansByCountry,
    scansByCity,
    scansBySource,
    scansByHour,
    scansByAbVariant,
  };
}
