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
