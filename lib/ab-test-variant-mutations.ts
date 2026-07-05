import {
  type AbTestData,
  emptyAbTestData,
  sanitizeAbTestData,
} from '@/lib/ab-routing';

type Variant = (typeof emptyAbTestData.variants)[number];

export function getAbTestVariants(data: AbTestData) {
  return data.variants ?? emptyAbTestData.variants;
}

export function patchAbTestVariant(
  data: AbTestData,
  index: number,
  patch: Partial<Variant>,
): AbTestData {
  const variants = getAbTestVariants(data);
  const next = variants.map((v, i) => (i === index ? { ...v, ...patch } : v));
  return sanitizeAbTestData({ ...data, variants: next });
}

export function addAbTestVariant(data: AbTestData): AbTestData {
  const variants = getAbTestVariants(data);
  if (variants.length >= 5) return data;
  return sanitizeAbTestData({
    ...data,
    variants: [
      ...variants,
      {
        id: `v${variants.length + 1}`,
        label: `Variant ${variants.length + 1}`,
        url: '',
        weight: 10,
      },
    ],
  });
}

export function removeAbTestVariant(data: AbTestData, index: number): AbTestData {
  const variants = getAbTestVariants(data);
  if (variants.length <= 2) return data;
  return sanitizeAbTestData({ ...data, variants: variants.filter((_, i) => i !== index) });
}
