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
  referralRewardClaimed?: boolean;
}

export function parseBrandingSettings(raw: unknown): BrandingSettings {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const o = raw as Record<string, unknown>;
  return {
    hidePoweredBy: Boolean(o.hidePoweredBy),
    agencyName: typeof o.agencyName === 'string' ? o.agencyName : undefined,
    supportEmail: typeof o.supportEmail === 'string' ? o.supportEmail : undefined,
    referralRewardClaimed: Boolean(o.referralRewardClaimed),
  };
}

export function canUseWhiteLabel(planId: string): boolean {
  return planId === 'agency' || planId === 'business';
}
