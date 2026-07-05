import type { IndustryPrintLayout } from '@/lib/industry-print-layouts';
import type { QRStyleConfig } from '@/lib/qr-style';
import { PRINT_TEMPLATES, type PrintTemplateId } from '@/lib/print-banner';

export interface PrintBannerExportProps {
  shortCode: string;
  qrName?: string;
  style: Partial<QRStyleConfig>;
  logoPreview?: string | null;
  accentColor?: string;
  printLayout?: IndustryPrintLayout;
  industryTemplateId?: string;
}

export function orderPrintTemplates(printLayout?: IndustryPrintLayout) {
  if (!printLayout) return PRINT_TEMPLATES.map((tpl) => ({ tpl, recommended: false }));
  const order = [printLayout.recommended, ...printLayout.alternates];
  const seen = new Set<string>();
  const sorted = order
    .filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return PRINT_TEMPLATES.some((t) => t.id === id);
    })
    .map((id) => ({
      tpl: PRINT_TEMPLATES.find((t) => t.id === id)!,
      recommended: id === printLayout.recommended,
    }));
  for (const tpl of PRINT_TEMPLATES) {
    if (!seen.has(tpl.id)) sorted.push({ tpl, recommended: false });
  }
  return sorted;
}

export type OrderedPrintTemplate = ReturnType<typeof orderPrintTemplates>[number];
