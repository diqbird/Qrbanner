import { prisma } from '@/lib/db';
import crypto from 'crypto';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCode(length = 8): string {
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join('');
}

export async function ensureReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (user?.referralCode) return user.referralCode;

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode(8);
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
      return code;
    } catch {
      /* collision */
    }
  }
  throw new Error('Could not generate referral code');
}

export async function resolveReferrerByCode(code: string): Promise<string | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const user = await prisma.user.findFirst({
    where: { referralCode: normalized },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function recordReferralSignup(referrerUserId: string, referredUserId: string): Promise<void> {
  if (referrerUserId === referredUserId) return;
  const referred = await prisma.user.findUnique({
    where: { id: referredUserId },
    select: { referredByUserId: true },
  });
  if (referred?.referredByUserId) return;

  await prisma.user.update({
    where: { id: referredUserId },
    data: { referredByUserId: referrerUserId },
  });
  await prisma.user.update({
    where: { id: referrerUserId },
    data: { referralSignupCount: { increment: 1 } },
  });
}

export interface BrandingSettings {
  hidePoweredBy?: boolean;
  agencyName?: string;
  supportEmail?: string;
  logoUrl?: string;
  brandColor?: string;
  referralRewardClaimed?: boolean;
  preferredLocale?: 'en' | 'tr';
}

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeBrandColor(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!HEX_COLOR_RE.test(trimmed)) return undefined;
  return trimmed.length === 4
    ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`.toLowerCase()
    : trimmed.toLowerCase();
}

export function normalizeLogoUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    return trimmed.slice(0, 500);
  } catch {
    return undefined;
  }
}

export function parseBrandingSettings(raw: unknown): BrandingSettings {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const o = raw as Record<string, unknown>;
  const preferredLocale = o.preferredLocale === 'tr' ? 'tr' : o.preferredLocale === 'en' ? 'en' : undefined;
  return {
    hidePoweredBy: Boolean(o.hidePoweredBy),
    agencyName: typeof o.agencyName === 'string' ? o.agencyName : undefined,
    supportEmail: typeof o.supportEmail === 'string' ? o.supportEmail : undefined,
    logoUrl: normalizeLogoUrl(o.logoUrl),
    brandColor: normalizeBrandColor(o.brandColor),
    referralRewardClaimed: Boolean(o.referralRewardClaimed),
    preferredLocale,
  };
}

export function resolveUserEmailLocale(brandingSettings: unknown): 'en' | 'tr' {
  const branding = parseBrandingSettings(brandingSettings);
  return branding.preferredLocale === 'tr' ? 'tr' : 'en';
}

export function canUseWhiteLabel(planId: string): boolean {
  return planId === 'agency' || planId === 'business';
}
