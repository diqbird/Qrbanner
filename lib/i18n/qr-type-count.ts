import { INDUSTRY_TEMPLATES } from '@/lib/industry-templates';
import { PLANS } from '@/lib/plans';
import { SCAN_MILESTONES } from '@/lib/scan-notify-constants';
import { QR_CATEGORIES } from '@/lib/qr-utils';
import { formatLocaleNumber, formatLocaleNumberList } from './format-locale';
import type { Locale } from './types';

export function formatQrTypeCount(locale: Locale): string {
  return `${formatLocaleNumber(QR_CATEGORIES.length, locale)}+`;
}

export function formatIndustryTemplateCount(locale: Locale): string {
  return formatLocaleNumber(INDUSTRY_TEMPLATES.length, locale);
}

export function formatFreeBulkImportMax(locale: Locale): string {
  return formatLocaleNumber(PLANS.free.maxBulkRows, locale);
}

export function localizeMarketingNumbers(text: string, locale: Locale): string {
  const milestones = formatLocaleNumberList(SCAN_MILESTONES, locale);
  const bulkMax = formatFreeBulkImportMax(locale);
  return text
    .replace(/26\+/g, formatQrTypeCount(locale))
    .replace(/\(10, 50, 100…\)/g, `(${milestones}…)`)
    .replace(/\(10, 50, 100\.\.\.\)/g, `(${milestones}…)`)
    .replace(/up to 100 QR codes/gi, `up to ${bulkMax} QR codes`)
    .replace(/100'e kadar QR/gi, `${bulkMax}'e kadar QR`)
    .replace(/\b10 industry templates\b/gi, `${formatIndustryTemplateCount(locale)} industry templates`)
    .replace(/\b10 sektör şablonu\b/gi, `${formatIndustryTemplateCount(locale)} sektör şablonu`);
}
