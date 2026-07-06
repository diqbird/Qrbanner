type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

const DEVICE_SLUGS: Record<string, string> = {
  Desktop: 'desktop',
  Mobile: 'mobile',
  Tablet: 'tablet',
};

const BROWSER_SLUGS: Record<string, string> = {
  Chrome: 'chrome',
  Firefox: 'firefox',
  Safari: 'safari',
  Edge: 'edge',
  Opera: 'opera',
};

const OS_SLUGS: Record<string, string> = {
  Windows: 'windows',
  macOS: 'macos',
  Linux: 'linux',
  Android: 'android',
  iOS: 'ios',
};

function resolveSlugLabel(
  t: TranslateFn,
  value: string,
  slugs: Record<string, string>,
  prefix: string,
): string {
  if (!value || value === 'Unknown') {
    return resolved(t, 'analytics.unknown', 'Unknown');
  }
  const slug = slugs[value];
  if (slug) {
    return resolved(t, `${prefix}.${slug}`, value);
  }
  return value;
}

export function resolveAnalyticsDeviceLabel(t: TranslateFn, value: string): string {
  return resolveSlugLabel(t, value, DEVICE_SLUGS, 'analytics.deviceLabels');
}

export function resolveAnalyticsBrowserLabel(t: TranslateFn, value: string): string {
  return resolveSlugLabel(t, value, BROWSER_SLUGS, 'analytics.browserLabels');
}

export function resolveAnalyticsOsLabel(t: TranslateFn, value: string): string {
  return resolveSlugLabel(t, value, OS_SLUGS, 'analytics.osLabels');
}

export function localizeNamedValues(
  rows: { name: string; value: number }[],
  localize: (name: string) => string,
) {
  return rows.map((row) => ({ ...row, name: localize(row.name) }));
}
