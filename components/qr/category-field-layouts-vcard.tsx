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
