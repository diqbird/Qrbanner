'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateFieldLabel,
  resolveTemplateName,
  resolveTemplateSectionDescription,
  resolveTemplateSectionTitle,
  resolveTemplateTagline,
} from '@/lib/i18n/resolve-template-copy';
import { getTemplateById, type IndustryTemplate } from '@/lib/industry-templates';
import { resolveCategoryShortName } from '@/lib/i18n/resolve-qr-category-copy';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function IndustryTemplateCard({
  template,
  onApply,
}: {
  template: IndustryTemplate;
  onApply: (t: IndustryTemplate) => void;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const displayName = resolveTemplateName(t, template.id, template.name);
  const tagline = resolveTemplateTagline(t, template.id, template.tagline);

  return (
    <div className="rounded-lg border overflow-hidden" data-testid={`industry-template-${template.id}`}>
      <button
        type="button"
        onClick={() => onApply(getTemplateById(template.id) ?? template)}
        className="w-full p-3 text-left hover:bg-primary/5 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tagline}</p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {resolveCategoryShortName(t, template.category)}
          </Badge>
        </div>
      </button>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-1 border-t py-1.5 text-[10px] text-muted-foreground hover:bg-muted/50"
      >
        {t('templates.picker.sectionsCount', { n: template.sections.length })}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="border-t bg-muted/30 px-3 py-2 space-y-2">
          {template.sections.map((s) => (
            <div key={s.id}>
              <p className="text-xs font-medium">{resolveTemplateSectionTitle(t, template.id, s)}</p>
              <p className="text-[10px] text-muted-foreground">
                {resolveTemplateSectionDescription(t, template.id, s)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {s.fields.map((f) => resolveTemplateFieldLabel(t, template.id, f)).join(' · ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
