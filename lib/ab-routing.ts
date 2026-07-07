export const MAX_AB_VARIANTS = 5;

export interface AbVariant {
  id: string;
  label: string;
  url: string;
  weight: number;
}

export interface AbTestData {
  variants: AbVariant[];
  sticky: boolean;
}

export const emptyAbTestData: AbTestData = {
  variants: [
    { id: 'a', label: 'Variant A', url: '', weight: 50 },
    { id: 'b', label: 'Variant B', url: '', weight: 50 },
  ],
  sticky: true,
};

export function parseAbTestData(raw: unknown): AbTestData {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return emptyAbTestData;
  const d = raw as Partial<AbTestData>;
  const variants = Array.isArray(d.variants)
    ? d.variants
        .filter((v) => v && typeof v === 'object' && v.url)
        .slice(0, MAX_AB_VARIANTS)
        .map((v, i) => ({
          id: String(v.id ?? `v${i + 1}`),
          label: String(v.label ?? `Variant ${i + 1}`),
          url: String(v.url).trim(),
          weight: Math.max(0, Math.min(100, Number(v.weight) || 0)),
        }))
    : emptyAbTestData.variants;
  return {
    variants: variants.length >= 2 ? variants : emptyAbTestData.variants,
    sticky: d.sticky !== false,
  };
}

export function sanitizeAbTestData(data: AbTestData): AbTestData {
  const variants = data.variants
    .filter((v) => v.url)
    .slice(0, MAX_AB_VARIANTS)
    .map((v, i) => ({
      id: v.id || `v${i + 1}`,
      label: v.label || `Variant ${i + 1}`,
      url: v.url.trim(),
      weight: Math.max(1, Math.min(100, v.weight || 1)),
    }));
  if (variants.length < 2) return emptyAbTestData;
  const total = variants.reduce((s, v) => s + v.weight, 0);
  const normalized = variants.map((v) => ({
    ...v,
    weight: Math.round((v.weight / total) * 100),
  }));
  const drift = 100 - normalized.reduce((s, v) => s + v.weight, 0);
  if (drift !== 0) normalized[0].weight += drift;
  return { variants: normalized, sticky: data.sticky !== false };
}

function pickWeighted(variants: AbVariant[]): AbVariant {
  const total = variants.reduce((s, v) => s + v.weight, 0);
  let r = Math.random() * total;
  for (const v of variants) {
    r -= v.weight;
    if (r <= 0) return v;
  }
  return variants[variants.length - 1];
}

export function resolveAbVariant(
  data: AbTestData,
  cookieVariantId?: string | null
): { variantId: string; url: string; label: string } | null {
  const variants = data.variants.filter((v) => v.url);
  if (variants.length < 2) return null;

  if (data.sticky && cookieVariantId) {
    const sticky = variants.find((v) => v.id === cookieVariantId);
    if (sticky) return { variantId: sticky.id, url: sticky.url, label: sticky.label };
  }

  const picked = pickWeighted(variants);
  return { variantId: picked.id, url: picked.url, label: picked.label };
}

export function abCookieName(shortCode: string): string {
  return `qb_ab_${shortCode}`;
}
