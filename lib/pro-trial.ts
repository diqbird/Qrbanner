import { prisma } from '@/lib/db';
import { normalizePlanId } from '@/lib/plans';

export const PRO_TRIAL_DAYS = 14;

type TrialUserRow = {
  id?: string;
  plan: string;
  emailVerified: Date | null;
  proTrialUsedAt: Date | null;
  planGrantExpiresAt: Date | null;
  paddleSubscriptionId: string | null;
};

export function trialDaysRemaining(expiresAt: Date | null | undefined, now = new Date()): number {
  if (!expiresAt) return 0;
  const ms = expiresAt.getTime() - now.getTime();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

export function isActivePlanGrant(expiresAt: Date | null | undefined, now = new Date()): boolean {
  return Boolean(expiresAt && expiresAt.getTime() > now.getTime());
}

export function canStartProTrial(user: TrialUserRow, now = new Date()): boolean {
  if (!user.emailVerified) return false;
  if (user.proTrialUsedAt) return false;
  if (user.paddleSubscriptionId) return false;
  if (normalizePlanId(user.plan) !== 'free') return false;
  if (isActivePlanGrant(user.planGrantExpiresAt, now)) return false;
  return true;
}

export function isProTrialActive(user: TrialUserRow, now = new Date()): boolean {
  return (
    normalizePlanId(user.plan) === 'pro' &&
    !user.paddleSubscriptionId &&
    isActivePlanGrant(user.planGrantExpiresAt, now)
  );
}

export async function syncPlanGrantExpiry(userId: string, now = new Date()): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      paddleSubscriptionId: true,
      planGrantExpiresAt: true,
    },
  });
  if (!user || user.paddleSubscriptionId) return;
  if (!user.planGrantExpiresAt || user.planGrantExpiresAt.getTime() > now.getTime()) return;
  if (normalizePlanId(user.plan) === 'free') return;

  await prisma.user.update({
    where: { id: userId },
    data: { plan: 'free', planGrantExpiresAt: null },
  });
}

export async function maybeStartProTrial(userId: string, now = new Date()): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      emailVerified: true,
      proTrialUsedAt: true,
      planGrantExpiresAt: true,
      paddleSubscriptionId: true,
    },
  });
  if (!user || !canStartProTrial(user, now)) return false;

  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + PRO_TRIAL_DAYS);

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: 'pro',
      proTrialUsedAt: now,
      planGrantExpiresAt: expiresAt,
    },
  });
  return true;
}

export async function startProTrial(userId: string, now = new Date()) {
  const started = await maybeStartProTrial(userId, now);
  if (!started) {
    return { ok: false as const, error: 'not_eligible' as const };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planGrantExpiresAt: true },
  });

  return {
    ok: true as const,
    expiresAt: user?.planGrantExpiresAt?.toISOString() ?? null,
    daysLeft: trialDaysRemaining(user?.planGrantExpiresAt, now),
  };
}

export async function getProTrialStatus(userId: string, now = new Date()) {
  await syncPlanGrantExpiry(userId, now);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      emailVerified: true,
      proTrialUsedAt: true,
      planGrantExpiresAt: true,
      paddleSubscriptionId: true,
    },
  });
  if (!user) {
    return {
      eligible: false,
      active: false,
      daysLeft: 0,
      expiresAt: null as string | null,
    };
  }

  const active = isProTrialActive(user, now);
  return {
    eligible: canStartProTrial(user, now),
    active,
    daysLeft: active ? trialDaysRemaining(user.planGrantExpiresAt, now) : 0,
    expiresAt: user.planGrantExpiresAt?.toISOString() ?? null,
  };
}
