import type { Locale } from './types';
import type { UseCasePage } from '@/lib/use-case-pages';
import { USE_CASE_COPY_TR } from './use-case-copy-tr';
import type { QrTypePage } from '@/lib/qr-type-pages';
import { QR_TYPE_COPY_TR } from './qr-type-copy-tr';

export function localizeUseCasePage(page: UseCasePage, locale: Locale): UseCasePage {
  if (locale !== 'tr') return page;
  const tr = USE_CASE_COPY_TR[page.slug];
  return tr ? { ...page, ...tr } : page;
}

export function localizeQrTypePage(page: QrTypePage, locale: Locale): QrTypePage {
  if (locale !== 'tr') return page;
  const tr = QR_TYPE_COPY_TR[page.slug];
  return tr ? { ...page, ...tr } : page;
}

export { localizeSolutionPage } from './solution-localize';

export function useCaseTitleKey(slug: string): string {
  return `useCasesPages.${slug}.title`;
}
