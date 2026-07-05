'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function CryptoLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.cryptocurrency')}</Label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data?.coin ?? 'btc'}
          onChange={(e) => updateField('coin', e.target.value)}
        >
          <option value="btc">{t('fields.coinBtc')}</option>
          <option value="eth">{t('fields.coinEth')}</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.walletAddress')}</Label>
        <Input
          value={data?.address ?? ''}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder={t('fields.walletPlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.suggestedAmount')}</Label>
        <Input
          placeholder={t('fields.amountPlaceholder')}
          value={data?.amount ?? ''}
          onChange={(e) => updateField('amount', e.target.value)}
        />
      </div>
    </div>
  );
}

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
