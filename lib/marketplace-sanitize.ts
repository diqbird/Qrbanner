import type { MarketplaceListingInput, MarketplaceListingStatus } from '@/lib/marketplace-types';
import { MARKETPLACE_LISTING_STATUSES } from '@/lib/marketplace-types';

const MIN_PRICE_CENTS = 0;
const MAX_PRICE_CENTS = 500_00;

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function safeUrl(raw: string | undefined): string | null {
  const value = String(raw ?? '').trim();
  if (!value) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function sanitizeListingInput(raw: unknown): MarketplaceListingInput | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const title = clip(String(r.title ?? ''), 120);
  const description = clip(String(r.description ?? ''), 2000);
  if (!title || !description) return null;

  const priceCents = Math.round(Number(r.priceCents ?? 0));
  if (!Number.isFinite(priceCents) || priceCents < MIN_PRICE_CENTS || priceCents > MAX_PRICE_CENTS) {
    return null;
  }

  const status = MARKETPLACE_LISTING_STATUSES.includes(r.status as MarketplaceListingStatus)
    ? (r.status as MarketplaceListingStatus)
    : 'draft';

  const templateId = r.templateId ? clip(String(r.templateId), 80) : null;
  const category = r.category ? clip(String(r.category), 40) : null;
  const previewUrl = r.previewUrl ? safeUrl(String(r.previewUrl)) : null;

  return {
    title,
    description,
    priceCents,
    templateId,
    category,
    previewUrl,
    status,
  };
}
