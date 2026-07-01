'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Target, X, ChevronDown, ChevronUp, ScanLine, Palette, Printer } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateCtaSuggestions,
  resolveTemplateName,
  resolveTemplateTagline,
  resolveTemplateTips,
  resolveTemplateUseCases,
} from '@/lib/i18n/resolve-template-copy';
import { resolveVisualDesignStyle, resolveVisualPresetName } from '@/lib/i18n/resolve-visual-preset-copy';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { categoryShortName } from '@/lib/qr-utils';
import { computeScannability } from '@/lib/scannability';
import { getVisualPresetById } from '@/lib/visual-qr-presets';
import { PRINT_TEMPLATES } from '@/lib/print-banner';
import {
  resolveIndustryPrintNotes,
  resolvePrintTemplateName,
} from '@/lib/i18n/resolve-print-copy';

export function IndustryTemplateGuide({
  template,
  onDismiss,
}: {
  template: IndustryTemplate;
  onDismiss?: () => void;
}) {
  const { t } = useLanguage();
  const [tipsOpen, setTipsOpen] = useState(false);
  const profile = template.designProfile;
  const scan = computeScannability(template.style);
  const visualPreset = template.visualPresetId ? getVisualPresetById(template.visualPresetId) : undefined;
  const displayName = resolveTemplateName(t, template.id, template.name);
  const tagline = resolveTemplateTagline(t, template.id, template.tagline);
  const useCases = resolveTemplateUseCases(t, template.id, template.useCases);
  const tips = resolveTemplateTips(t, template.id, template.tips);
  const ctaSuggestions = profile
    ? resolveTemplateCtaSuggestions(t, template.id, profile.ctaSuggestions)
    : [];
  const recommendedPrint = template.printLayout
    ? PRINT_TEMPLATES.find((p) => p.id === template.printLayout?.recommended)
    : undefined;

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3" data-testid="industry-template-guide">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{displayName}</p>
            <Badge variant="secondary" className="text-[10px]">
              {categoryShortName(template.category)}
            </Badge>
            {profile ? (
              <Badge variant="outline" className="text-[10px]">
                {resolveVisualDesignStyle(t, profile.designStyle)}
              </Badge>
            ) : null}
            {visualPreset ? (
              <Badge variant="outline" className="text-[10px]">
                {resolveVisualPresetName(t, visualPreset)}
              </Badge>
            ) : null}
            <Badge
              variant={scan.grade === 'A' || scan.grade === 'B' ? 'secondary' : 'destructive'}
              className="text-[10px] gap-0.5"
            >
              <ScanLine className="h-3 w-3" />
              {scan.grade} · {scan.score}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{tagline}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={onDismiss}
          aria-label={t('templates.guide.dismissAria')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-2 h-7 gap-1 px-2 text-xs text-muted-foreground"
        onClick={() => setTipsOpen((v) => !v)}
      >
        {tipsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {tipsOpen ? t('templates.guide.hideTips') : t('templates.guide.showTips')}
      </Button>

      {tipsOpen && (
        <div className="mt-3 space-y-3 border-t border-primary/20 pt-3">
          {profile ? (
            <div>
              <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Palette className="h-3.5 w-3.5" /> {t('templates.guide.suggestedCtas')}
              </p>
              <div className="flex flex-wrap gap-1">
                {ctaSuggestions.map((cta) => (
                  <Badge key={cta} variant="outline" className="text-[10px] font-normal">
                    {cta}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {template.printLayout ? (
            <div>
              <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Printer className="h-3.5 w-3.5" /> {t('templates.guide.recommendedPrint')}
              </p>
              <div className="flex flex-wrap gap-1 mb-1">
                <Badge variant="secondary" className="text-[10px] font-normal">
                  {recommendedPrint
                    ? resolvePrintTemplateName(t, recommendedPrint.id, recommendedPrint.name)
                    : template.printLayout.recommended}
                </Badge>
                <span className="text-[10px] text-muted-foreground self-center">
                  {t('templates.guide.minPrintQr', { cm: template.printLayout.minPrintCm })}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {resolveIndustryPrintNotes(t, template.id, template.printLayout.notes)}
              </p>
            </div>
          ) : null}
          <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Target className="h-3.5 w-3.5" /> {t('templates.guide.bestFor')}
            </p>
            <div className="flex flex-wrap gap-1">
              {useCases.map((u) => (
                <Badge key={u} variant="outline" className="text-[10px] font-normal">
                  {u}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" /> {t('templates.guide.helpfulTips')}
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="shrink-0 text-primary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
