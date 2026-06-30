export type Locale = 'en' | 'tr';

export const LOCALES: { id: Locale; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'tr', label: 'TR' },
];

export const LOCALE_STORAGE_KEY = 'qrb-locale';

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export function getNestedValue(tree: TranslationTree, path: string): string | undefined {
  const parts = path.split('.');
  let current: string | TranslationTree | undefined = tree;
  for (const part of parts) {
    if (!current || typeof current === 'string') return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? `{{${key}}}`));
}
