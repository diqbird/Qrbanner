'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { VISUAL_PRESET_CATEGORIES, type VisualPresetCategory } from '@/lib/visual-qr-presets';

export function VisualPresetCategoryTabs({
  category,
  onCategoryChange,
}: {
  category: VisualPresetCategory | 'all';
  onCategoryChange: (category: VisualPresetCategory | 'all') => void;
}) {
  const { t } = useLanguage();

  const categoryLabel = (id: VisualPresetCategory) =>
    t(`templates.visualPresets.categories.${id}`);

  return (
    <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t('templates.visualPresets.title')}>
      <button
        type="button"
        role="tab"
        aria-selected={category === 'all'}
        data-testid="visual-preset-category-all"
        onClick={() => onCategoryChange('all')}
        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
          category === 'all' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
        }`}
      >
        {t('templates.visualPresets.all')}
      </button>
      {VISUAL_PRESET_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={category === cat.id}
          data-testid={`visual-preset-category-${cat.id}`}
          onClick={() => onCategoryChange(cat.id)}
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
            category === cat.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
          }`}
        >
          {categoryLabel(cat.id)}
        </button>
      ))}
    </div>
  );
}
