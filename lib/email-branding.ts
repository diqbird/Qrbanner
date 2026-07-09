import { prisma } from '@/lib/db';
import { parseBrandingSettings } from '@/lib/referral';
import type { EmailShellOptions } from '@/lib/i18n/email-shell';

export type TenantEmailBrand = {
  fromName: string;
  shell: EmailShellOptions;
  brandColor?: string;
  supportEmail?: string;
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
  const supportEmail = branding.supportEmail?.trim() || undefined;
  const brandColor = branding.brandColor;
  const canWhiteLabel =
    workspace.owner.plan === 'agency' || workspace.owner.plan === 'business';

  if (!agencyName) {
    return {
      ...DEFAULT_BRAND,
      supportEmail,
      brandColor: canWhiteLabel ? brandColor : undefined,
    };
  }

  return {
    fromName: agencyName,
    supportEmail,
    brandColor: canWhiteLabel ? brandColor : undefined,
    shell: {
      brandName: agencyName,
      hidePoweredBy: canWhiteLabel && Boolean(branding.hidePoweredBy),
    },
  };
}
