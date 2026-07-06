'use client';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  resolveIndustryPrintNotes,
  resolvePrintTemplateDescription,
  resolvePrintTemplateName,
  resolvePrintTemplatePhysicalSize,
  resolvePrintTemplateUseCase,
} from '@/lib/i18n/resolve-print-copy';
import type { PrintBannerExportState } from '@/hooks/use-print-banner-export';

export function PrintBannerTemplatePicker({ exportState }: { exportState: PrintBannerExportState }) {
  const {
    t,
    templateId,
    setTemplateId,
    orderedTemplates,
    printLayout,
    industryTemplateId,
  } = exportState;

  return (
    <div className="space-y-2">
      <Label>{t('printBanner.template')}</Label>
      {printLayout ? (
        <p className="text-xs text-muted-foreground">
          {industryTemplateId
            ? resolveIndustryPrintNotes(t, industryTemplateId, printLayout.notes)
            : printLayout.notes}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {orderedTemplates.map(({ tpl, recommended }) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => setTemplateId(tpl.id)}
            className={`relative rounded-lg border p-3 text-left transition-all ${
              templateId === tpl.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border/50 hover:border-border'
            }`}
          >
            {recommended ? (
              <Badge className="absolute right-2 top-2 text-[9px] px-1.5 py-0">
                {t('printBanner.recommended')}
              </Badge>
            ) : null}
            <p className="text-sm font-medium pr-16">{resolvePrintTemplateName(t, tpl.id, tpl.name)}</p>
            <p className="text-xs text-muted-foreground">
              {resolvePrintTemplateDescription(t, tpl.id, tpl.description)}
            </p>
            {tpl.physicalSize ? (
              <p className="text-[10px] text-muted-foreground mt-1">
                {resolvePrintTemplatePhysicalSize(t, tpl.id, tpl.physicalSize)}
                {tpl.useCase
                  ? ` · ${resolvePrintTemplateUseCase(t, tpl.id, tpl.useCase)}`
                  : ''}
              </p>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
