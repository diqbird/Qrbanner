'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/i18n/language-provider';
import { INDUSTRY_TEMPLATES, type IndustryTemplate } from '@/lib/industry-templates';
import { LayoutTemplate } from 'lucide-react';
import { IndustryTemplateCard } from './industry-template-card';

export function IndustryTemplatePicker({
  onApply,
}: {
  onApply: (template: IndustryTemplate) => void;
}) {
  const { t } = useLanguage();

  return (
    <Card data-testid="industry-template-picker">
      <CardHeader className="pb-2">
        <CardTitle as="h2" className="font-display text-base flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-primary" /> {t('templates.picker.title')}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{t('templates.picker.subtitle')}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 max-h-[360px] overflow-y-auto pr-1">
          {INDUSTRY_TEMPLATES.map((template) => (
            <IndustryTemplateCard key={template.id} template={template} onApply={onApply} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
