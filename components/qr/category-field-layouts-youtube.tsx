'use client';

import { CategoryUrlField, CategoryUsernameField } from './category-field-primitives';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

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
