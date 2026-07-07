import { MAX_CAMPAIGN_PROMPT_LEN } from '@/lib/campaign-types';
import { formatLocaleNumber } from './format-locale';
import type { Locale } from './types';

export function campaignPromptMaxVars(locale: Locale): Record<string, string> {
  return { max: formatLocaleNumber(MAX_CAMPAIGN_PROMPT_LEN, locale) };
}
