import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { validatePassword } from '@/lib/password';
import { assertPasswordLoginAllowed } from '@/lib/workspace-sso';

import type { StudioEntitlementStatus, StudioEntitlementView } from '@/lib/studio-types';

export type { StudioEntitlementStatus, StudioEntitlementView };

export function normalizeStudioEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function generateStudioToken(): string {
  return crypto.randomBytes(24).toString('base64url');
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '•••';
  const head = local.slice(0, 1);
  const tail = local.length > 2 ? local.slice(-1) : '';
  return `${head}•••${tail}@${domain}`;
}

export function studioPublicPath(token: string): string {
  return `/studio/${token}`;
}

export function studioPublicUrl(token: string): string {
  const base = process.env.NEXTAUTH_URL ?? 'https://qrbanner.com';
  return `${base.replace(/\/$/, '')}${studioPublicPath(token)}`;
}

function syncExpiredStatus(
  row: {
    id: string;
    status: string;
    expiresAt: Date | null;
  },
  now = new Date(),
): StudioEntitlementStatus {
  let status = row.status as StudioEntitlementStatus;
  if (
    status !== 'revoked' &&
    status !== 'exhausted' &&
    row.expiresAt &&
    row.expiresAt.getTime() <= now.getTime()
  ) {
    status = 'expired';
    void prisma.studioEntitlement.update({
      where: { id: row.id },
      data: { status: 'expired' },
    });
  }
  return status;
}

export function isStudioDeliveryActive(deliveryStatus: string): boolean {
  return deliveryStatus === 'sent';
}

export function toStudioEntitlementView(
  row: {
    id: string;
    token: string;
    buyerEmail: string;
    maxQr: number;
    qrRemaining: number;
    status: string;
    deliveryStatus: string;
    source: string;
    externalOrderId: string | null;
    expiresAt: Date | null;
    claimedAt: Date | null;
    sentAt: Date | null;
    userId: string | null;
  },
  viewerUserId?: string | null,
  now = new Date(),
): StudioEntitlementView {
  const status = syncExpiredStatus(row, now);
  const deliveryStatus = (
    row.deliveryStatus === 'awaiting_approval' ? 'awaiting_approval' : 'sent'
  ) as StudioEntitlementView['deliveryStatus'];
  const isOwner = Boolean(viewerUserId && row.userId === viewerUserId);
  const delivered = isStudioDeliveryActive(row.deliveryStatus);
  const canCreate =
    delivered &&
    isOwner &&
    status === 'claimed' &&
    row.qrRemaining > 0 &&
    (!row.expiresAt || row.expiresAt.getTime() > now.getTime());

  return {
    id: row.id,
    token: row.token,
    buyerEmail: row.buyerEmail,
    buyerEmailMasked: maskEmail(row.buyerEmail),
    maxQr: row.maxQr,
    qrRemaining: row.qrRemaining,
    status,
    deliveryStatus,
    source: row.source,
    externalOrderId: row.externalOrderId,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    claimedAt: row.claimedAt?.toISOString() ?? null,
    sentAt: row.sentAt?.toISOString() ?? null,
    isOwner,
    canCreate,
  };
}

export async function getStudioEntitlementByToken(token: string, viewerUserId?: string | null) {
  const row = await prisma.studioEntitlement.findUnique({ where: { token } });
  if (!row) return null;
  return toStudioEntitlementView(row, viewerUserId);
}

export async function getActiveStudioEntitlementForUser(userId: string) {
  const rows = await prisma.studioEntitlement.findMany({
    where: {
      userId,
      status: { in: ['claimed'] },
      qrRemaining: { gt: 0 },
    },
    orderBy: { claimedAt: 'desc' },
    take: 5,
  });
  const now = new Date();
  for (const row of rows) {
    const view = toStudioEntitlementView(row, userId, now);
    if (view.canCreate) return view;
  }
  return null;
}

export async function assertStudioCanCreate(
  userId: string,
  entitlementId: string,
): Promise<{ ok: true; entitlementId: string } | { ok: false; error: string }> {
  const row = await prisma.studioEntitlement.findUnique({ where: { id: entitlementId } });
  if (!row || row.userId !== userId) {
    return { ok: false, error: 'studio_entitlement_not_found' };
  }

  const view = toStudioEntitlementView(row, userId);
  if (view.status === 'expired') {
    return { ok: false, error: 'studio_entitlement_expired' };
  }
  if (view.status === 'revoked') {
    return { ok: false, error: 'studio_entitlement_revoked' };
  }
  if (view.status === 'exhausted' || view.qrRemaining <= 0) {
    return { ok: false, error: 'studio_entitlement_exhausted' };
  }
  if (view.status !== 'claimed') {
    return { ok: false, error: 'studio_entitlement_not_active' };
  }
  if (!isStudioDeliveryActive(row.deliveryStatus)) {
    return { ok: false, error: 'studio_entitlement_not_delivered' };
  }

  return { ok: true, entitlementId: row.id };
}

export async function consumeStudioQr(entitlementId: string): Promise<void> {
  const updated = await prisma.studioEntitlement.update({
    where: { id: entitlementId },
    data: {
      qrRemaining: { decrement: 1 },
    },
  });

  if (updated.qrRemaining <= 0 && updated.status === 'claimed') {
    await prisma.studioEntitlement.update({
      where: { id: entitlementId },
      data: { status: 'exhausted' },
    });
  }
}

type ClaimAction = 'register' | 'login' | 'claim';

export async function claimStudioEntitlement({
  token,
  action,
  email,
  password,
  name,
}: {
  token: string;
  action: ClaimAction;
  email: string;
  password?: string;
  name?: string;
}): Promise<
  | { ok: true; entitlement: StudioEntitlementView; userId: string; email: string }
  | { ok: false; code: string }
> {
  const normalizedEmail = normalizeStudioEmail(email);
  const row = await prisma.studioEntitlement.findUnique({ where: { token } });
  if (!row) return { ok: false, code: 'invalid_token' };

  if (!isStudioDeliveryActive(row.deliveryStatus)) {
    return { ok: false, code: 'not_delivered' };
  }

  const status = syncExpiredStatus(row);
  if (status === 'revoked') return { ok: false, code: 'revoked' };
  if (status === 'expired') return { ok: false, code: 'expired' };
  if (status === 'exhausted') return { ok: false, code: 'exhausted' };

  if (normalizedEmail !== row.buyerEmail) {
    return { ok: false, code: 'email_mismatch' };
  }

  if (status === 'claimed') {
    if (!row.userId) return { ok: false, code: 'invalid_state' };
    const existing = await prisma.user.findUnique({ where: { id: row.userId } });
    if (!existing) return { ok: false, code: 'invalid_state' };
    if (existing.email !== normalizedEmail) {
      return { ok: false, code: 'link_already_used' };
    }
    if (action === 'login') {
      if (!password) return { ok: false, code: 'missing_password' };
      if (!existing.password) return { ok: false, code: 'oauth_only' };
      const valid = await bcrypt.compare(password, existing.password);
      if (!valid) return { ok: false, code: 'invalid_credentials' };
      return {
        ok: true,
        userId: existing.id,
        email: existing.email,
        entitlement: toStudioEntitlementView(row, existing.id),
      };
    }
    return {
      ok: true,
      userId: existing.id,
      email: existing.email,
      entitlement: toStudioEntitlementView(row, existing.id),
    };
  }

  if (status !== 'pending') {
    return { ok: false, code: 'link_already_used' };
  }

  if (action === 'claim') {
    return { ok: false, code: 'auth_required' };
  }

  let userId: string;

  if (action === 'register') {
    if (!password) return { ok: false, code: 'missing_password' };
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) return { ok: false, code: pwCheck.code };

    const ssoCheck = await assertPasswordLoginAllowed(normalizedEmail);
    if (!ssoCheck.ok) return { ok: false, code: ssoCheck.code };

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) return { ok: false, code: 'email_exists' };

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name?.trim() || null,
        emailVerified: new Date(),
        brandingSettings: { studioClaim: true },
      },
    });
    userId = user.id;
  } else {
    if (!password) return { ok: false, code: 'missing_password' };
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.password) return { ok: false, code: 'invalid_credentials' };
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return { ok: false, code: 'invalid_credentials' };
    userId = user.id;
  }

  const claimResult = await prisma.studioEntitlement.updateMany({
    where: { id: row.id, status: 'pending' },
    data: {
      status: 'claimed',
      userId,
      claimedAt: new Date(),
    },
  });

  if (claimResult.count === 0) {
    return { ok: false, code: 'link_already_used' };
  }

  const claimed = await prisma.studioEntitlement.findUnique({ where: { id: row.id } });
  if (!claimed) return { ok: false, code: 'invalid_token' };

  return {
    ok: true,
    userId,
    email: normalizedEmail,
    entitlement: toStudioEntitlementView(claimed, userId),
  };
}

export async function createStudioEntitlement(input: {
  buyerEmail: string;
  maxQr: number;
  externalOrderId?: string | null;
  expiresAt?: Date | null;
  notes?: string | null;
  source?: string;
  deliveryStatus?: 'awaiting_approval' | 'sent';
}) {
  const maxQr = Math.max(1, Math.min(20, Math.floor(input.maxQr)));
  const token = generateStudioToken();
  const deliveryStatus = input.deliveryStatus ?? 'sent';
  return prisma.studioEntitlement.create({
    data: {
      token,
      buyerEmail: normalizeStudioEmail(input.buyerEmail),
      maxQr,
      qrRemaining: maxQr,
      externalOrderId: input.externalOrderId?.trim() || null,
      expiresAt: input.expiresAt ?? null,
      notes: input.notes?.trim() || null,
      source: input.source?.trim() || 'admin',
      status: 'pending',
      deliveryStatus,
      sentAt: deliveryStatus === 'sent' ? new Date() : null,
    },
  });
}

/** Register an Etsy order — link exists but buyer cannot claim until admin approves & sends email. */
export async function registerEtsyStudioOrder(input: {
  buyerEmail: string;
  externalOrderId?: string | null;
  notes?: string | null;
  maxQr?: number;
}): Promise<{ row: Awaited<ReturnType<typeof createStudioEntitlement>>; created: boolean }> {
  const orderId = input.externalOrderId?.trim();
  if (orderId) {
    const existing = await prisma.studioEntitlement.findFirst({
      where: { source: 'etsy', externalOrderId: orderId },
    });
    if (existing) return { row: existing, created: false };
  }

  const row = await createStudioEntitlement({
    buyerEmail: input.buyerEmail,
    maxQr: input.maxQr ?? 5,
    externalOrderId: input.externalOrderId,
    notes: input.notes,
    source: 'etsy',
    deliveryStatus: 'awaiting_approval',
  });
  return { row, created: true };
}

export async function getStudioDeliveryForResend(id: string) {
  const row = await prisma.studioEntitlement.findUnique({ where: { id } });
  if (!row) return { ok: false as const, code: 'not_found' as const };
  if (row.source !== 'etsy') return { ok: false as const, code: 'not_etsy' as const };
  if (row.deliveryStatus !== 'sent') return { ok: false as const, code: 'not_sent' as const };
  if (row.status === 'revoked') return { ok: false as const, code: 'revoked' as const };
  return { ok: true as const, row, url: studioPublicUrl(row.token) };
}

export async function approveAndSendStudioDelivery(id: string) {
  const row = await prisma.studioEntitlement.findUnique({ where: { id } });
  if (!row) return { ok: false as const, code: 'not_found' };
  if (row.deliveryStatus !== 'awaiting_approval') {
    return { ok: false as const, code: 'already_sent' };
  }
  if (row.status === 'revoked') return { ok: false as const, code: 'revoked' };

  const now = new Date();
  const updated = await prisma.studioEntitlement.update({
    where: { id },
    data: {
      deliveryStatus: 'sent',
      approvedAt: now,
      sentAt: now,
    },
  });

  return {
    ok: true as const,
    row: updated,
    url: studioPublicUrl(updated.token),
  };
}

/** Claim a pending token for an already signed-in user (email must match buyerEmail). */
export async function claimStudioWithSession(
  userId: string,
  token: string,
): Promise<
  | { ok: true; entitlement: StudioEntitlementView; userId: string; email: string }
  | { ok: false; code: string }
> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  if (!user) return { ok: false, code: 'unauthorized' };

  const row = await prisma.studioEntitlement.findUnique({ where: { token } });
  if (!row) return { ok: false, code: 'invalid_token' };

  if (!isStudioDeliveryActive(row.deliveryStatus)) {
    return { ok: false, code: 'not_delivered' };
  }

  const status = syncExpiredStatus(row);
  if (status === 'revoked') return { ok: false, code: 'revoked' };
  if (status === 'expired') return { ok: false, code: 'expired' };
  if (status === 'exhausted') return { ok: false, code: 'exhausted' };

  if (user.email !== row.buyerEmail) {
    return { ok: false, code: 'email_mismatch' };
  }

  if (status === 'claimed') {
    if (row.userId !== userId) return { ok: false, code: 'link_already_used' };
    return {
      ok: true,
      userId: user.id,
      email: user.email,
      entitlement: toStudioEntitlementView(row, userId),
    };
  }

  if (status !== 'pending') {
    return { ok: false, code: 'link_already_used' };
  }

  const claimResult = await prisma.studioEntitlement.updateMany({
    where: { id: row.id, status: 'pending' },
    data: {
      status: 'claimed',
      userId,
      claimedAt: new Date(),
    },
  });

  if (claimResult.count === 0) {
    return { ok: false, code: 'link_already_used' };
  }

  const claimed = await prisma.studioEntitlement.findUnique({ where: { id: row.id } });
  if (!claimed) return { ok: false, code: 'invalid_token' };

  return {
    ok: true,
    userId: user.id,
    email: user.email,
    entitlement: toStudioEntitlementView(claimed, userId),
  };
}
