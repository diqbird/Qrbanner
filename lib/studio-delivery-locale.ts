/** Parse delivery email locale from admin notes (e.g. "locale:tr" or "lang=tr"). */
export function resolveStudioDeliveryLocale(notes: string | null | undefined): 'en' | 'tr' {
  const text = (notes ?? '').toLowerCase();
  if (/(?:locale|lang)\s*[:=]\s*tr\b/.test(text)) return 'tr';
  return 'en';
}
