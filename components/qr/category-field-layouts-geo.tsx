'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryUrlField } from './category-field-primitives';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function LocationLayout({ data, updateField, t }: CategoryFieldPrimitiveProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fields.latitude')}</Label>
          <Input
            type="number"
            step="any"
            placeholder={t('fields.latPlaceholder')}
            value={data?.latitude ?? ''}
            onChange={(e) => updateField('latitude', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('fields.longitude')}</Label>
          <Input
            type="number"
            step="any"
            placeholder={t('fields.lngPlaceholder')}
            value={data?.longitude ?? ''}
            onChange={(e) => updateField('longitude', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('fields.placeName')}</Label>
        <Input
          placeholder={t('fields.placeNamePlaceholder')}
          value={data?.label ?? ''}
          onChange={(e) => updateField('label', e.target.value)}
        />
      </div>
    </div>
  );
}

export function GoogleReviewLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>{t('fields.googlePlaceId')}</Label>
        <Input
          placeholder={t('fields.googlePlaceIdPlaceholder')}
          value={data?.placeId ?? ''}
          onChange={(e) => updateField('placeId', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.googlePlaceIdHint')}</p>
      </div>
      <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.googleReviewUrlPlaceholder')}
        label={t('fields.urlLabel.googleReview')}
      />
    </div>
  );
}
