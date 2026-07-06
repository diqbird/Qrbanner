import { QR_CATEGORIES, QR_CATEGORY_GROUPS } from '@/lib/qr-utils';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;
type QrCategoryMeta = (typeof QR_CATEGORIES)[number];
type QrCategoryGroupMeta = (typeof QR_CATEGORY_GROUPS)[number];

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

function getCategory(category: string): QrCategoryMeta | undefined {
  return QR_CATEGORIES.find((c) => c.id === category) as QrCategoryMeta | undefined;
}

function getCategoryGroup(groupId: string): QrCategoryGroupMeta | undefined {
  return QR_CATEGORY_GROUPS.find((g) => g.id === groupId) as QrCategoryGroupMeta | undefined;
}

export function resolveCategoryDisplayName(t: TranslateFn, category: string): string {
  const cat = getCategory(category);
  return resolved(t, `qrCategories.types.${category}.name`, cat?.name ?? category);
}

export function resolveCategoryShortName(t: TranslateFn, category: string): string {
  const cat = getCategory(category);
  const fallback = cat ? cat.shortName : category;
  return resolved(t, `qrCategories.types.${category}.shortName`, fallback);
}

export function resolveCategoryDescription(t: TranslateFn, category: string): string {
  const cat = getCategory(category);
  return resolved(t, `qrCategories.types.${category}.description`, cat?.description ?? '');
}

export function resolveCategoryGroupLabel(t: TranslateFn, groupId: string): string {
  const group = getCategoryGroup(groupId);
  return resolved(t, `qrCategories.groups.${groupId}.label`, group?.label ?? groupId);
}

export function resolveCategoryGroupSubtitle(t: TranslateFn, groupId: string): string {
  const group = getCategoryGroup(groupId);
  return resolved(t, `qrCategories.groups.${groupId}.subtitle`, group?.subtitle ?? '');
}
