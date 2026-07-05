'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  VISUAL_QR_PRESETS,
  VISUAL_PRESET_CATEGORIES,
  type VisualPresetCategory,
} from '@/lib/visual-qr-presets';
import type { QRStyleConfig } from '@/lib/qr-style';
import { LayoutTemplate } from 'lucide-react';
import { VisualPresetCategoryTabs } from './visual-preset-category-tabs';
import { VisualPresetGrid } from './visual-preset-card';

export { findMatchingVisualPresetId } from '@/lib/visual-preset-utils';

export function VisualPresetPicker({
  currentStyle,
  onApply,
  highlightPresetId,
}: {
  currentStyle: Partial<QRStyleConfig>;
  onApply: (style: QRStyleConfig) => void;
  highlightPresetId?: string;
}) {
  const { t } = useLanguage();
  const [category, setCategory] = useState<VisualPresetCategory | 'all'>('all');

  const filtered = useMemo(
    () =>
      category === 'all'
        ? VISUAL_QR_PRESETS
        : VISUAL_QR_PRESETS.filter((p) => p.category === category),
    [category],
  );

  const categoryLabel = (id: VisualPresetCategory) =>
    t(`templates.visualPresets.categories.${id}`);

  return (
    <div className="space-y-3 rounded-lg border border-border/50 p-4" data-testid="visual-preset-picker">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">{t('templates.visualPresets.title')}</Label>
        <Badge variant="secondary" className="ml-auto text-[10px]">
          {VISUAL_QR_PRESETS.length}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{t('templates.visualPresets.subtitle')}</p>

      <VisualPresetCategoryTabs category={category} onCategoryChange={setCategory} />

      <div className="max-h-[360px] overflow-y-auto pr-1 space-y-4">
        {category === 'all' ? (
          VISUAL_PRESET_CATEGORIES.map((cat) => {
            const group = VISUAL_QR_PRESETS.filter((p) => p.category === cat.id);
            if (!group.length) return null;
            return (
              <section key={cat.id} data-testid={`visual-preset-group-${cat.id}`}>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {categoryLabel(cat.id)}
                </h4>
                <VisualPresetGrid
                  presets={group}
                  highlightPresetId={highlightPresetId}
                  currentStyle={currentStyle}
                  onApply={onApply}
                />
              </section>
            );
          })
        ) : (
          <VisualPresetGrid
            presets={filtered}
            highlightPresetId={highlightPresetId}
            currentStyle={currentStyle}
            onApply={onApply}
          />
        )}
      </div>
    </div>
  );
}
