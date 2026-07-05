'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategoryUrlField } from './category-field-primitives';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function UrlLayout({ category, data, updateField, t }: CategoryFieldPrimitiveProps) {
  return <CategoryUrlField category={category} data={data} updateField={updateField} t={t} />;
}

export function UrlLabeledLayout({ category, config, data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <CategoryUrlField
      category={category}
      data={data}
      updateField={updateField}
      t={t}
      placeholder={config.urlPlaceholderKey ? t(`fields.${config.urlPlaceholderKey}`) : undefined}
      label={config.urlLabelKey ? t(`fields.urlLabel.${config.urlLabelKey}`) : undefined}
    />
  );
}

export function TextLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-2">
      <Label>{t('fields.textMessage')}</Label>
      <Textarea
        rows={4}
        value={data?.text ?? ''}
        onChange={(e) => updateField('text', e.target.value)}
        placeholder={t('fields.textPlaceholder')}
      />
    </div>
  );
}
