import { prisma } from '@/lib/db';
import { parseBrandingSettings } from '@/lib/referral';
import type { EmailShellOptions } from '@/lib/i18n/email-shell';

export type TenantEmailBrand = {
  fromName: string;
  shell: EmailShellOptions;
};

const DEFAULT_BRAND: TenantEmailBrand = {
  fromName: 'QRbanner',
  shell: {},
};

/** Resolve white-label email brand for a workspace (owner branding). */
export async function resolveWorkspaceEmailBrand(
  workspaceId?: string | null,
): Promise<TenantEmailBrand> {
  if (!workspaceId) return DEFAULT_BRAND;
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { owner: { select: { brandingSettings: true, plan: true } } },
  });
  if (!workspace?.owner) return DEFAULT_BRAND;

  const branding = parseBrandingSettings(workspace.owner.brandingSettings);
  const agencyName = branding.agencyName?.trim();
  if (!agencyName) return DEFAULT_BRAND;

  const canWhiteLabel =
    workspace.owner.plan === 'agency' || workspace.owner.plan === 'business';

  return {
    fromName: agencyName,
    shell: {
      brandName: agencyName,
      hidePoweredBy: canWhiteLabel && Boolean(branding.hidePoweredBy),
    },
  };
}
