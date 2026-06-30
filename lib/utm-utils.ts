export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

/** Append UTM query params to http(s) URLs. Skips mailto:, tel:, sms:. */
export function appendUtmParams(url: string, params: UtmParams): string {
  if (!url) return url;
  const lower = url.toLowerCase();
  if (lower.startsWith('mailto:') || lower.startsWith('tel:') || lower.startsWith('sms:')) {
    return url;
  }

  let normalized = url;
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  try {
    const parsed = new URL(normalized);
    Object.entries(params).forEach(([key, value]) => {
      if (value) parsed.searchParams.set(key, value);
    });
    return parsed.toString();
  } catch {
    return url;
  }
}

export function buildUtmForQR(qr: {
  utmEnabled?: boolean | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  name?: string;
  shortCode?: string;
}): UtmParams | null {
  if (!qr.utmEnabled) return null;
  return {
    utm_source: qr.utmSource || 'qrbanner',
    utm_medium: qr.utmMedium || 'qr',
    utm_campaign: qr.utmCampaign || qr.name || qr.shortCode || 'campaign',
  };
}

export function applyUtmToUrl(
  url: string,
  qr: Parameters<typeof buildUtmForQR>[0]
): string {
  const utm = buildUtmForQR(qr);
  if (!utm) return url;
  return appendUtmParams(url, utm);
}
