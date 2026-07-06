'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScanLine, X } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { IndustryTemplateGuideCopy } from '@/lib/industry-template-guide-copy';
import { resolveCategoryShortName } from '@/lib/i18n/resolve-qr-category-copy';
import type { IndustryTemplate } from '@/lib/industry-templates';

export function IndustryTemplateGuideHeader({
  template,
  copy,
  onDismiss,
}: {
  template: IndustryTemplate;
  copy: IndustryTemplateGuideCopy;
  onDismiss?: () => void;
}) {
  const { t } = useLanguage();
  const { scan, displayName, tagline, designStyleLabel, visualPresetLabel } = copy;

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{displayName}</p>
          <Badge variant="secondary" className="text-[10px]">
            {resolveCategoryShortName(t, template.category)}
          </Badge>
          {designStyleLabel ? (
            <Badge variant="outline" className="text-[10px]">
              {designStyleLabel}
            </Badge>
          ) : null}
          {visualPresetLabel ? (
            <Badge variant="outline" className="text-[10px]">
              {visualPresetLabel}
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
  );
}
