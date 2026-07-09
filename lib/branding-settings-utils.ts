export type BrandingForm = {
  hidePoweredBy: boolean;
  agencyName: string;
  supportEmail: string;
  logoUrl: string;
  brandColor: string;
};

export function parseBranding(json: unknown): BrandingForm {
  const data = json as { branding?: Record<string, unknown> };
  const b = data.branding ?? {};
  return {
    hidePoweredBy: Boolean(b.hidePoweredBy),
    agencyName: String(b.agencyName ?? ''),
    supportEmail: String(b.supportEmail ?? ''),
    logoUrl: String(b.logoUrl ?? ''),
    brandColor: String(b.brandColor ?? ''),
  };
}
