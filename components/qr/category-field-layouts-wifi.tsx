'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function WifiLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.wifiName')}</Label>
        <Input
          value={data?.ssid ?? ''}
          onChange={(e) => updateField('ssid', e.target.value)}
          placeholder={t('fields.wifiSsidPlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.wifiPassword')}</Label>
        <Input value={data?.password ?? ''} onChange={(e) => updateField('password', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.securityType')}</Label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={data?.encryption ?? 'WPA'}
          onChange={(e) => updateField('encryption', e.target.value)}
        >
          <option value="WPA">{t('fields.wifiWpa')}</option>
          <option value="WEP">{t('fields.wifiWep')}</option>
          <option value="nopass">{t('fields.wifiOpen')}</option>
        </select>
      </div>
    </div>
  );
}
