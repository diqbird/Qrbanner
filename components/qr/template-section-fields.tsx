'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateSectionDescription,
  resolveTemplateSectionTitle,
} from '@/lib/i18n/resolve-template-copy';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { TemplateFieldInput } from './template-field-input';

export function TemplateSectionFields({
  template,
  data,
  onChange,
}: {
  template: IndustryTemplate;
  data: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
}) {
  const { t } = useLanguage();
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5" data-testid="template-section-fields">
      {template.sections.map((section) => (
        <div key={section.id} className="space-y-3">
          <div>
            <p className="text-sm font-medium">
              {resolveTemplateSectionTitle(t, template.id, section)}
            </p>
            {section.description ? (
              <p className="text-xs text-muted-foreground">
                {resolveTemplateSectionDescription(t, template.id, section)}
              </p>
            ) : null}
          </div>
          <div className="space-y-3">
            {section.fields.map((field) => (
              <TemplateFieldInput
                key={field.key}
                templateId={template.id}
                field={field}
                value={data[field.key] ?? ''}
                onChange={update}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
