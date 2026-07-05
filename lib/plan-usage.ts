import { prisma } from '@/lib/db';
import { getPlanLimits, normalizePlanId, type PlanLimits } from '@/lib/plans';
import { syncPlanGrantExpiry } from '@/lib/pro-trial';

export interface PlanUsage {
  plan: PlanLimits;
  qrCodes: number;
  customDomains: number;
  qrLimit: number;
  domainLimit: number;
  canCreateQr: boolean;
  canAddDomain: boolean;
}

export async function getUserPlanUsage(userId: string): Promise<PlanUsage> {
  await syncPlanGrantExpiry(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  const plan = getPlanLimits(user?.plan);

  const [qrCodes, customDomains] = await Promise.all([
    prisma.qRCode.count({ where: { userId, isArchived: false } }),
    prisma.customDomain.count({ where: { userId } }),
  ]);

  return {
    plan,
    qrCodes,
    customDomains,
    qrLimit: plan.maxQrCodes,
    domainLimit: plan.maxCustomDomains,
    canCreateQr: qrCodes < plan.maxQrCodes,
    canAddDomain: customDomains < plan.maxCustomDomains,
  };
}

export async function assertCanCreateQr(userId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const usage = await getUserPlanUsage(userId);
  if (!usage.canCreateQr) {
    return {
      ok: false,
      error: `QR limit reached (${usage.qrLimit} on ${usage.plan.name} plan). Upgrade or delete unused codes.`,
    };
  }
  return { ok: true };
}

export async function assertCanAddDomain(userId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const usage = await getUserPlanUsage(userId);
  if (!usage.canAddDomain) {
    return {
      ok: false,
      error: `Custom domain limit reached (${usage.domainLimit} on ${usage.plan.name} plan).`,
    };
  }
  return { ok: true };
}

export function getUserPlanId(raw: string | null | undefined) {
  return normalizePlanId(raw);
}
