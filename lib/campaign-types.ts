import type { LandingPageData } from '@/lib/landing-page';
import type { QRStyleConfig } from '@/lib/qr-style';

export type CampaignLocale = 'en' | 'tr';

export type CampaignQrItem = {
  /** Client-side key for list editing */
  key: string;
  name: string;
  category: string;
  purpose: string;
  qrData: Record<string, string>;
  templateId?: string;
  landingEnabled?: boolean;
  landingPage?: Partial<LandingPageData>;
  style?: Partial<QRStyleConfig>;
  enabled: boolean;
};

export type CampaignPlan = {
  businessName: string;
  industry: string;
  summary: string;
  accentColor: string;
  items: CampaignQrItem[];
  printSuggestions: string[];
  source: 'llm' | 'template';
};

export type CampaignGenerateInput = {
  prompt: string;
  locale: CampaignLocale;
  businessName?: string;
  websiteUrl?: string;
};

export const MAX_CAMPAIGN_PROMPT_LEN = 500;
export const MAX_CAMPAIGN_ITEMS = 8;
