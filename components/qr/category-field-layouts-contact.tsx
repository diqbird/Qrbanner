'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function VcardLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fields.firstName')}</Label>
          <Input value={data?.firstName ?? ''} onChange={(e) => updateField('firstName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>{t('fields.lastName')}</Label>
          <Input value={data?.lastName ?? ''} onChange={(e) => updateField('lastName', e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.jobTitle')}</Label>
        <Input
          value={data?.title ?? ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder={t('fields.jobTitlePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.companyName')}</Label>
        <Input value={data?.org ?? ''} onChange={(e) => updateField('org', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.phone')}</Label>
        <Input
          value={data?.phone ?? ''}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder={t('fields.phonePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.yourEmail')}</Label>
        <Input value={data?.email ?? ''} onChange={(e) => updateField('email', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.website')}</Label>
        <Input
          value={data?.website ?? ''}
          onChange={(e) => updateField('website', e.target.value)}
          placeholder={t('fields.websitePlaceholder')}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.addressOptional')}</Label>
        <Textarea
          value={data?.address ?? ''}
          onChange={(e) => updateField('address', e.target.value)}
          rows={2}
          placeholder={t('fields.addressPlaceholder')}
        />
      </div>
    </div>
  );
}

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
