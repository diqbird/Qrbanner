import {
  ONBOARDING_ETA_MAX_MINUTES,
  ONBOARDING_GOAL_SECONDS,
} from '@/lib/onboarding-timing-policy';
import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export function onboardingTimingVars(locale: Locale): Record<string, string> {
  return {
    seconds: formatLocaleNumber(ONBOARDING_GOAL_SECONDS, locale),
    minutes: formatLocaleNumber(ONBOARDING_ETA_MAX_MINUTES, locale),
  };
}
