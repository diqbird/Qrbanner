import { prisma } from '@/lib/db';
import { getPlanLimits, normalizePlanId, type PlanLimits } from '@/lib/plans';
import { syncPlanGrantExpiry } from '@/lib/pro-trial';
import { assertStudioCanCreate } from '@/lib/studio-entitlement';

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

export async function assertCanCreateQr(
  userId: string,
  opts?: { studioEntitlementId?: string },
): Promise<{ ok: true; studio?: true } | { ok: false; error: string }> {
  if (opts?.studioEntitlementId) {
    const studioCheck = await assertStudioCanCreate(userId, opts.studioEntitlementId);
    if (studioCheck.ok) return { ok: true, studio: true };
    return { ok: false, error: studioCheck.error };
  }

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
