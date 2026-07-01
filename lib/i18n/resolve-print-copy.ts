import type { PrintTemplateId } from '@/lib/print-banner';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function resolvePrintTemplateName(
  t: TranslateFn,
  id: PrintTemplateId,
  fallback: string,
): string {
  return resolved(t, `templates.printFormats.${id}.name`, fallback);
}

export function resolvePrintTemplateDescription(
  t: TranslateFn,
  id: PrintTemplateId,
  fallback: string,
): string {
  return resolved(t, `templates.printFormats.${id}.description`, fallback);
}

export function resolveIndustryPrintNotes(
  t: TranslateFn,
  templateId: string,
  fallback: string,
): string {
  return resolved(t, `templates.printLayouts.${templateId}.notes`, fallback);
}

export function resolveIndustryPrintHeadline(
  t: TranslateFn,
  templateId: string,
  fallback: string,
): string {
  return resolved(t, `templates.printLayouts.${templateId}.headline`, fallback);
}

export function resolveIndustryPrintSubtitle(
  t: TranslateFn,
  templateId: string,
  fallback: string,
): string {
  return resolved(t, `templates.printLayouts.${templateId}.subtitle`, fallback);
}
