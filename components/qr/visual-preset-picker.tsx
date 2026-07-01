'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveVisualDesignStyle,
  resolveVisualPresetDescription,
  resolveVisualPresetName,
} from '@/lib/i18n/resolve-visual-preset-copy';
import {
  VISUAL_QR_PRESETS,
  VISUAL_PRESET_CATEGORIES,
  type VisualQRPreset,
  type VisualPresetCategory,
} from '@/lib/visual-qr-presets';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import { computeScannability } from '@/lib/scannability';
import { LayoutTemplate } from 'lucide-react';

function PresetSwatch({ preset }: { preset: VisualQRPreset }) {
  const fg = preset.style.fgColor ?? '#000';
  const bg = preset.style.bgColor ?? '#fff';
  return (
    <div className="flex h-8 w-full overflow-hidden rounded-md border border-border/60">
      <div className="flex-1" style={{ background: bg }} />
      <div className="w-1/3" style={{ background: fg }} />
    </div>
  );
}

function PresetCard({
  preset,
  active,
  onSelect,
}: {
  preset: VisualQRPreset;
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useLanguage();
  const grade = computeScannability(preset.style).grade;
  const name = resolveVisualPresetName(t, preset);
  const description = resolveVisualPresetDescription(t, preset);
  const designStyle = resolveVisualDesignStyle(t, preset.designStyle);
  return (
    <button
      type="button"
      onClick={onSelect}
      data-testid={`visual-preset-${preset.id}`}
      className={`flex flex-col gap-1.5 rounded-lg border p-2.5 text-left transition-all hover:border-primary/50 ${
        active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/60'
      }`}
    >
      <PresetSwatch preset={preset} />
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">{description}</p>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-[9px] px-1 py-0 capitalize">
          {designStyle}
        </Badge>
        <Badge variant="secondary" className="text-[9px] px-1 py-0">
          {grade}
        </Badge>
      </div>
    </button>
  );
}

function PresetGrid({
  presets,
  highlightPresetId,
  currentStyle,
  onApply,
}: {
  presets: VisualQRPreset[];
  highlightPresetId?: string;
  currentStyle: Partial<QRStyleConfig>;
  onApply: (style: QRStyleConfig) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {presets.map((preset) => (
        <PresetCard
          key={preset.id}
          preset={preset}
          active={highlightPresetId === preset.id}
          onSelect={() => onApply(normalizeQRStyle({ ...currentStyle, ...preset.style }))}
        />
      ))}
    </div>
  );
}

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
    [category]
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

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t('templates.visualPresets.title')}>
        <button
          type="button"
          role="tab"
          aria-selected={category === 'all'}
          data-testid="visual-preset-category-all"
          onClick={() => setCategory('all')}
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
            onClick={() => setCategory(cat.id)}
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
              category === cat.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
            }`}
          >
            {categoryLabel(cat.id)}
          </button>
        ))}
      </div>

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
                <PresetGrid
                  presets={group}
                  highlightPresetId={highlightPresetId}
                  currentStyle={currentStyle}
                  onApply={onApply}
                />
              </section>
            );
          })
        ) : (
          <PresetGrid
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

export function findMatchingVisualPresetId(style: Partial<QRStyleConfig>): string | undefined {
  const s = normalizeQRStyle(style);
  return VISUAL_QR_PRESETS.find(
    (p) =>
      p.style.fgColor === s.fgColor &&
      p.style.bgColor === s.bgColor &&
      (p.style.dotStyle ?? 'square') === s.dotStyle &&
      (p.style.frameStyle ?? 'none') === s.frameStyle
  )?.id;
}
