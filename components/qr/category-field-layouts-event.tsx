'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function EventLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.eventName')}</Label>
        <Input
          value={data?.title ?? ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder={t('fields.eventNamePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.eventLocation')}</Label>
        <Input
          value={data?.location ?? ''}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder={t('fields.eventLocationPlaceholder')}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fields.starts')}</Label>
          <Input
            type="datetime-local"
            value={data?.startDate ?? ''}
            onChange={(e) => updateField('startDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('fields.ends')}</Label>
          <Input
            type="datetime-local"
            value={data?.endDate ?? ''}
            onChange={(e) => updateField('endDate', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.descriptionOptional')}</Label>
        <Textarea value={data?.description ?? ''} onChange={(e) => updateField('description', e.target.value)} />
      </div>
    </div>
  );
}
