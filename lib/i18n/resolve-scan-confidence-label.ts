import type { DecodeConfidence } from '@/lib/qr-scan-decode';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function resolveScanConfidenceBadgeLabel(t: TranslateFn, confidence: DecodeConfidence): string {
  if (confidence === 'high') return resolved(t, 'scan.confidenceBadgeHigh', 'High');
  if (confidence === 'medium') return resolved(t, 'scan.confidenceBadgeMedium', 'Medium');
  return resolved(t, 'scan.confidenceBadgeLow', 'Low');
}
