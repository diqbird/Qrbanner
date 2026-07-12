import { prisma } from '@/lib/db';
import { canUseWhiteLabel, parseBrandingSettings } from '@/lib/referral';
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
  const supportEmail = branding.supportEmail?.trim() || undefined;
  const canWhiteLabel = canUseWhiteLabel(workspace.owner.plan);
  const agencyName = canWhiteLabel ? branding.agencyName?.trim() : undefined;
  const brandColor = canWhiteLabel ? branding.brandColor : undefined;

  const logoUrl = canWhiteLabel ? branding.logoUrl : undefined;
  const shellChrome: EmailShellOptions =
    brandColor || logoUrl ? { brandColor, logoUrl } : {};

  if (!agencyName) {
    return {
      ...DEFAULT_BRAND,
      supportEmail,
      brandColor,
      shell: shellChrome,
    };
  }

  return {
    fromName: agencyName,
    supportEmail,
    brandColor,
    shell: {
      brandName: agencyName,
      hidePoweredBy: Boolean(branding.hidePoweredBy),
      ...shellChrome,
    },
  };
}
