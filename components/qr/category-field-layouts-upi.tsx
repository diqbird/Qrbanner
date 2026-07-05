'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function UpiLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.upiId')}</Label>
        <Input
          placeholder={t('fields.upiIdPlaceholder')}
          value={data?.vpa ?? ''}
          onChange={(e) => updateField('vpa', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.upiPayeeName')}</Label>
        <Input value={data?.payeeName ?? ''} onChange={(e) => updateField('payeeName', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.upiAmount')}</Label>
        <Input
          placeholder={t('fields.upiAmountPlaceholder')}
          value={data?.amount ?? ''}
          onChange={(e) => updateField('amount', e.target.value)}
        />
      </div>
    </div>
  );
}
