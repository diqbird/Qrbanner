import { QR_CATEGORIES } from '@/lib/qr-utils';
import type { CampaignPlan, CampaignQrItem } from '@/lib/campaign-types';
import { MAX_CAMPAIGN_ITEMS } from '@/lib/campaign-types';

const VALID_CATEGORIES = new Set(QR_CATEGORIES.map((c) => c.id));

export function sanitizeCampaignPlanForCreate(raw: unknown): CampaignPlan | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;

  const businessName = String(p.businessName ?? '').trim().slice(0, 80);
  if (!businessName) return null;

  const itemsRaw = Array.isArray(p.items) ? p.items : [];
  const items: CampaignQrItem[] = [];

  for (let i = 0; i < itemsRaw.length; i++) {
    if (items.length >= MAX_CAMPAIGN_ITEMS) break;
    const row = itemsRaw[i];
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    if (r.enabled === false) continue;

    const category = String(r.category ?? '').trim();
    const name = String(r.name ?? '').trim().slice(0, 80);
    if (!VALID_CATEGORIES.has(category as (typeof QR_CATEGORIES)[number]['id']) || !name) {
      continue;
    }

    const qrData: Record<string, string> = {};
    if (r.qrData && typeof r.qrData === 'object') {
      for (const [k, v] of Object.entries(r.qrData as Record<string, unknown>)) {
        if (typeof v === 'string') qrData[k] = v.slice(0, 500);
      }
    }

    items.push({
      key: String(r.key ?? `item-${i}`),
      name,
      category,
      purpose: String(r.purpose ?? '').slice(0, 160),
      qrData,
      templateId: r.templateId ? String(r.templateId).slice(0, 64) : undefined,
      landingEnabled: Boolean(r.landingEnabled),
      landingPage:
        r.landingPage && typeof r.landingPage === 'object'
          ? (r.landingPage as CampaignQrItem['landingPage'])
          : undefined,
      style:
        r.style && typeof r.style === 'object'
          ? (r.style as CampaignQrItem['style'])
          : undefined,
      enabled: true,
    });
  }

  if (!items.length) return null;

  return {
    businessName,
    industry: String(p.industry ?? 'general').slice(0, 40),
    summary: String(p.summary ?? '').slice(0, 300),
    accentColor: String(p.accentColor ?? '#0071e3').slice(0, 7),
    items,
    printSuggestions: Array.isArray(p.printSuggestions)
      ? p.printSuggestions.map((s) => String(s).slice(0, 60)).slice(0, 4)
      : [],
    source: p.source === 'llm' ? 'llm' : 'template',
  };
}
