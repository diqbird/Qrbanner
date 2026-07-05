'use client';

import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, Palette, Printer } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { IndustryTemplateGuideCopy } from '@/lib/industry-template-guide-copy';
import type { IndustryTemplate } from '@/lib/industry-templates';

export function IndustryTemplateGuideTips({
  template,
  copy,
}: {
  template: IndustryTemplate;
  copy: IndustryTemplateGuideCopy;
}) {
  const { t } = useLanguage();
  const { profile, ctaSuggestions, useCases, tips, recommendedPrintName, printNotes } = copy;

  return (
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
              {recommendedPrintName}
            </Badge>
            <span className="text-[10px] text-muted-foreground self-center">
              {t('templates.guide.minPrintQr', { cm: template.printLayout.minPrintCm })}
            </span>
          </div>
          {printNotes ? (
            <p className="text-[11px] text-muted-foreground">{printNotes}</p>
          ) : null}
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
  );
}
