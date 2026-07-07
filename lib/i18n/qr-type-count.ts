import { INDUSTRY_TEMPLATES } from '@/lib/industry-templates';
import { PLANS } from '@/lib/plans';
import { SCAN_MILESTONES } from '@/lib/scan-notify-constants';
import { QR_CATEGORIES } from '@/lib/qr-utils';
import { formatLocaleNumber, formatLocaleNumberList } from './format-locale';
import type { Locale } from './types';

/** Zapier marketplace app count cited in integration marketing copy. */
export const ZAPIER_INTEGRATION_APP_COUNT = 5_000;

export function formatQrTypeCount(locale: Locale): string {
  return `${formatLocaleNumber(QR_CATEGORIES.length, locale)}+`;
}

export function formatIndustryTemplateCount(locale: Locale): string {
  return formatLocaleNumber(INDUSTRY_TEMPLATES.length, locale);
}

export function formatIndustryTemplateCountPlus(locale: Locale): string {
  return `${formatIndustryTemplateCount(locale)}+`;
}

export function formatFreeBulkImportMax(locale: Locale): string {
  return formatLocaleNumber(PLANS.free.maxBulkRows, locale);
}

export function formatAgencyQrCodeCount(locale: Locale): string {
  return `${formatLocaleNumber(PLANS.agency.maxQrCodes, locale)}+`;
}

export function formatAgencyCustomDomainCount(locale: Locale): string {
  return formatLocaleNumber(PLANS.agency.maxCustomDomains, locale);
}

export function formatZapierAppCount(locale: Locale): string {
  return `${formatLocaleNumber(ZAPIER_INTEGRATION_APP_COUNT, locale)}+`;
}

export function marketingCountVars(locale: Locale): Record<string, string> {
  return {
    types: formatQrTypeCount(locale),
    templates: formatIndustryTemplateCountPlus(locale),
    apps: formatZapierAppCount(locale),
    codes: formatAgencyQrCodeCount(locale),
    domains: formatAgencyCustomDomainCount(locale),
  };
}

export function localizeMarketingNumbers(text: string, locale: Locale): string {
  const milestones = formatLocaleNumberList(SCAN_MILESTONES, locale);
  const bulkMax = formatFreeBulkImportMax(locale);
  return text
    .replace(/27\+/g, formatQrTypeCount(locale))
    .replace(/32\+/g, formatIndustryTemplateCountPlus(locale))
    .replace(/5,000\+/g, formatAgencyQrCodeCount(locale))
    .replace(/5\.000\+/g, formatAgencyQrCodeCount(locale))
    .replace(/26\+/g, formatQrTypeCount(locale))
    .replace(/\(10, 50, 100…\)/g, `(${milestones}…)`)
    .replace(/\(10, 50, 100\.\.\.\)/g, `(${milestones}…)`)
    .replace(/up to 100 QR codes/gi, `up to ${bulkMax} QR codes`)
    .replace(/100'e kadar QR/gi, `${bulkMax}'e kadar QR`)
    .replace(/\b10 industry templates\b/gi, `${formatIndustryTemplateCount(locale)} industry templates`)
    .replace(/\b10 sektör şablonu\b/gi, `${formatIndustryTemplateCount(locale)} sektör şablonu`);
}
