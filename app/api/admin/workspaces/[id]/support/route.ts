export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';
import { getAdminActorContext, recordAdminAudit } from '@/lib/admin-audit';

const SUPPORT_TIERS = ['standard', 'priority', 'enterprise'] as const;

const patchSchema = z.object({
  supportTier: z.enum(SUPPORT_TIERS).optional(),
  assignedCsmName: z.string().max(120).nullable().optional(),
  assignedCsmEmail: z.union([z.string().email(), z.literal(''), z.null()]).optional(),
  slaUptimePercent: z.number().min(90).max(100).nullable().optional(),
  slaNotes: z.string().max(2000).nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;
  const adminId = auth;

  const workspaceId = params.id;
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { id: true, name: true },
  });
  if (!workspace) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const data = parsed.data;
  const updated = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      ...(data.supportTier !== undefined ? { supportTier: data.supportTier } : {}),
      ...(data.assignedCsmName !== undefined
        ? { assignedCsmName: data.assignedCsmName?.trim() || null }
        : {}),
      ...(data.assignedCsmEmail !== undefined
        ? {
            assignedCsmEmail:
              data.assignedCsmEmail && String(data.assignedCsmEmail).trim()
                ? String(data.assignedCsmEmail).trim().toLowerCase()
                : null,
          }
        : {}),
      ...(data.slaUptimePercent !== undefined ? { slaUptimePercent: data.slaUptimePercent } : {}),
      ...(data.slaNotes !== undefined ? { slaNotes: data.slaNotes?.trim() || null } : {}),
    },
    select: {
      id: true,
      name: true,
      supportTier: true,
      assignedCsmName: true,
      assignedCsmEmail: true,
      slaUptimePercent: true,
      slaNotes: true,
    },
  });

  const actor = await getAdminActorContext(adminId, req);
  await recordAdminAudit({
    ...actor,
    action: 'site_settings.update',
    targetType: 'workspace_support',
    targetId: workspaceId,
    summary: `${workspace.name} → ${updated.supportTier}`,
    metadata: {
      supportTier: updated.supportTier,
      assignedCsmEmail: updated.assignedCsmEmail,
    },
  });

  return NextResponse.json({ workspace: updated });
}
