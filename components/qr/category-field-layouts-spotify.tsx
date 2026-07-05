'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryUrlField } from './category-field-primitives';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function SpotifyLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.spotifyUrlPlaceholder')}
        label={t('fields.urlLabel.spotifyLink')}
      />
      <div className="space-y-2">
        <Label>{t('fields.spotifyAdvanced')}</Label>
        <Input
          placeholder={t('fields.spotifyUriPlaceholder')}
          value={data?.uri ?? ''}
          onChange={(e) => updateField('uri', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{t('fields.spotifyUriHint')}</p>
      </div>
    </div>
  );
}
