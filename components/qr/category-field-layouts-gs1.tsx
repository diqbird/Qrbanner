'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function Gs1Layout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.gs1Gtin')}</Label>
        <Input
          placeholder={t('fields.gs1GtinPlaceholder')}
          inputMode="numeric"
          value={data?.gtin ?? ''}
          onChange={(e) => updateField('gtin', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.gs1GtinHint')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.gs1Domain')}</Label>
        <Input
          placeholder={t('fields.gs1DomainPlaceholder')}
          value={data?.domain ?? ''}
          onChange={(e) => updateField('domain', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.gs1DomainHint')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.gs1Lot')}</Label>
        <Input value={data?.lot ?? ''} onChange={(e) => updateField('lot', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.gs1Serial')}</Label>
        <Input value={data?.serial ?? ''} onChange={(e) => updateField('serial', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.gs1Expiry')}</Label>
        <Input type="date" value={data?.expiry ?? ''} onChange={(e) => updateField('expiry', e.target.value)} />
      </div>
    </div>
  );
}
