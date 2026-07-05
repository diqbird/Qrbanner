'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function ZoomLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.meetingId')}</Label>
        <Input
          placeholder={t('fields.meetingIdPlaceholder')}
          value={data?.meetingId ?? ''}
          onChange={(e) => updateField('meetingId', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('fields.meetingPassword')}</Label>
        <Input value={data?.password ?? ''} onChange={(e) => updateField('password', e.target.value)} />
      </div>
    </div>
  );
}

export function GoogleMeetLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-2">
      <Label>{t('fields.meetingCode')}</Label>
      <Input
        placeholder={t('fields.meetingCodePlaceholder')}
        value={data?.meetingCode ?? ''}
        onChange={(e) => updateField('meetingCode', e.target.value)}
      />
      <p className="text-xs text-muted-foreground">{t('fields.googleMeetHint')}</p>
    </div>
  );
}
