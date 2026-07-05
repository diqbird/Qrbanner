'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveIndustryTemplateGuideCopy } from '@/lib/industry-template-guide-copy';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { IndustryTemplateGuideHeader } from './industry-template-guide-header';
import { IndustryTemplateGuideTips } from './industry-template-guide-tips';

export function IndustryTemplateGuide({
  template,
  onDismiss,
}: {
  template: IndustryTemplate;
  onDismiss?: () => void;
}) {
  const { t } = useLanguage();
  const [tipsOpen, setTipsOpen] = useState(false);
  const copy = useMemo(() => resolveIndustryTemplateGuideCopy(t, template), [t, template]);

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3" data-testid="industry-template-guide">
      <IndustryTemplateGuideHeader template={template} copy={copy} onDismiss={onDismiss} />

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

      {tipsOpen && <IndustryTemplateGuideTips template={template} copy={copy} />}
    </div>
  );
}
