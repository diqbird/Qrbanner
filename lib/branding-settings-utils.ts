export type BrandingForm = {
  hidePoweredBy: boolean;
  agencyName: string;
  supportEmail: string;
};

export function parseBranding(json: unknown): BrandingForm {
  const data = json as { branding?: Record<string, unknown> };
  const b = data.branding ?? {};
  return {
    hidePoweredBy: Boolean(b.hidePoweredBy),
    agencyName: String(b.agencyName ?? ''),
    supportEmail: String(b.supportEmail ?? ''),
  };
}
