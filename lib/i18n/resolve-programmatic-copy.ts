import type { Locale } from './types';
import type { UseCasePage } from '@/lib/use-case-pages';
import { USE_CASE_COPY_TR } from './use-case-copy-tr';
import type { QrTypePage } from '@/lib/qr-type-pages';
import { QR_TYPE_COPY_TR } from './qr-type-copy-tr';
import { buildUseCaseDeTemplate, buildQrTypeDeTemplate } from './programmatic-copy-de';
import { buildUseCaseEsTemplate, buildQrTypeEsTemplate } from './programmatic-copy-es';

export function localizeUseCasePage(page: UseCasePage, locale: Locale): UseCasePage {
  if (locale === 'tr') {
    const tr = USE_CASE_COPY_TR[page.slug];
    return tr ? { ...page, ...tr } : page;
  }
  if (locale === 'de') return buildUseCaseDeTemplate(page);
  if (locale === 'es') return buildUseCaseEsTemplate(page);
  return page;
}

export function localizeQrTypePage(page: QrTypePage, locale: Locale): QrTypePage {
  if (locale === 'tr') {
    const tr = QR_TYPE_COPY_TR[page.slug];
    return tr ? { ...page, ...tr } : page;
  }
  if (locale === 'de') return buildQrTypeDeTemplate(page);
  if (locale === 'es') return buildQrTypeEsTemplate(page);
  return page;
}

export { localizeSolutionPage } from './solution-localize';

export function useCaseTitleKey(slug: string): string {
  return `useCasesPages.${slug}.title`;
}
