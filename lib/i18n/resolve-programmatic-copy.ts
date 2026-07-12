import type { Locale } from './types';
import type { UseCasePage } from '@/lib/use-case-pages';
import { USE_CASE_COPY_TR } from './use-case-copy-tr';
import { USE_CASE_COPY_DE } from './use-case-copy-de';
import { USE_CASE_COPY_ES } from './use-case-copy-es';
import type { QrTypePage } from '@/lib/qr-type-pages';
import { QR_TYPE_COPY_TR } from './qr-type-copy-tr';
import { QR_TYPE_COPY_DE } from './qr-type-copy-de';
import { QR_TYPE_COPY_ES } from './qr-type-copy-es';
import { buildUseCaseDeTemplate, buildQrTypeDeTemplate } from './programmatic-copy-de';
import { buildUseCaseEsTemplate, buildQrTypeEsTemplate } from './programmatic-copy-es';

export function localizeUseCasePage(page: UseCasePage, locale: Locale): UseCasePage {
  if (locale === 'tr') {
    const tr = USE_CASE_COPY_TR[page.slug];
    return tr ? { ...page, ...tr } : page;
  }
  if (locale === 'de') {
    const de = USE_CASE_COPY_DE[page.slug];
    return de ? { ...page, ...de } : buildUseCaseDeTemplate(page);
  }
  if (locale === 'es') {
    const es = USE_CASE_COPY_ES[page.slug];
    return es ? { ...page, ...es } : buildUseCaseEsTemplate(page);
  }
  return page;
}

export function localizeQrTypePage(page: QrTypePage, locale: Locale): QrTypePage {
  if (locale === 'tr') {
    const tr = QR_TYPE_COPY_TR[page.slug];
    return tr ? { ...page, ...tr } : page;
  }
  if (locale === 'de') {
    const de = QR_TYPE_COPY_DE[page.slug];
    return de ? { ...page, ...de } : buildQrTypeDeTemplate(page);
  }
  if (locale === 'es') {
    const es = QR_TYPE_COPY_ES[page.slug];
    return es ? { ...page, ...es } : buildQrTypeEsTemplate(page);
  }
  return page;
}

export { localizeSolutionPage } from './solution-localize';

export function useCaseTitleKey(slug: string): string {
  return `useCasesPages.${slug}.title`;
}
