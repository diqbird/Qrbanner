import { normalizePlanId } from '@/lib/plans';
import { planName } from '@/lib/i18n/pricing-content';
import type { Locale } from './types';

export function resolvePlanDisplayName(planId: string | null | undefined, locale: Locale = 'en'): string {
  return planName(normalizePlanId(planId ?? 'free'), locale);
}
