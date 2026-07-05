'use client';

import { CategoryUrlField, CategoryUsernameField } from './category-field-primitives';
import type { CategoryFieldPrimitiveProps } from './category-field-types';

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
