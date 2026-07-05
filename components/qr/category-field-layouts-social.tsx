'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategoryUrlField, CategoryUsernameField } from './category-field-primitives';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

export function SocialProfileLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <CategoryUsernameField
        data={data}
        updateField={updateField}
        label={t('fields.username')}
        placeholder={t('fields.usernameExample')}
        hint={t('fields.usernameHint')}
      />
      <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.urlPlaceholder')}
        label={t('fields.urlLabel.profileUrl')}
      />
    </div>
  );
}

export function YoutubeLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <CategoryUsernameField
        data={data}
        updateField={updateField}
        label={t('fields.channelName')}
        placeholder={t('fields.channelExample')}
        hint={t('fields.usernameHint')}
      />
      <p className="text-xs text-muted-foreground">{t('fields.orYoutubeUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.youtubeUrlPlaceholder')}
        label={t('fields.urlLabel.youtubeUrl')}
      />
    </div>
  );
}

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

export function PaypalLayout(props: CategoryFieldPrimitiveProps) {
  const { category, data, updateField, t } = props;
  return (
    <div className="space-y-3">
      <CategoryUsernameField
        data={data}
        updateField={updateField}
        label={t('fields.paypalUsername')}
        placeholder={t('fields.paypalUsernamePlaceholder')}
        hint={t('fields.paypalHint')}
      />
      <p className="text-xs text-muted-foreground">{t('fields.orFullUrl')}</p>
      <CategoryUrlField
        category={category}
        data={data}
        updateField={updateField}
        t={t}
        placeholder={t('fields.paypalUrlPlaceholder')}
        label={t('fields.urlLabel.paypal')}
      />
    </div>
  );
}
