'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveTemplateFieldHint,
  resolveTemplateFieldLabel,
  resolveTemplateFieldPlaceholder,
  resolveTemplateSectionDescription,
  resolveTemplateSectionTitle,
} from '@/lib/i18n/resolve-template-copy';
import type { IndustryTemplate, TemplateFieldDef } from '@/lib/industry-templates';

function FieldInput({
  templateId,
  field,
  value,
  onChange,
}: {
  templateId: string;
  field: TemplateFieldDef;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  const { t } = useLanguage();
  const id = `tpl-${field.key}`;
  const label = resolveTemplateFieldLabel(t, templateId, field);
  const placeholder = resolveTemplateFieldPlaceholder(t, templateId, field);
  const hint = resolveTemplateFieldHint(t, templateId, field);
  const common = {
    id,
    value: value ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(field.key, e.target.value),
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
        {field.required ? <span className="text-destructive ml-0.5">*</span> : null}
      </Label>
      {field.type === 'textarea' ? (
        <Textarea {...common} rows={3} placeholder={placeholder} />
      ) : field.type === 'select' && field.options ? (
        <select
          {...common}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          {...common}
          type={
            field.type === 'url'
              ? 'url'
              : field.type === 'email'
                ? 'email'
                : field.type === 'phone'
                  ? 'tel'
                  : field.type === 'number'
                    ? 'number'
                    : field.type === 'datetime'
                      ? 'datetime-local'
                      : 'text'
          }
          placeholder={placeholder}
        />
      )}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

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
              <FieldInput
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
