'use client';

import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  resolveVisualDesignStyle,
  resolveVisualPresetDescription,
  resolveVisualPresetName,
} from '@/lib/i18n/resolve-visual-preset-copy';
import type { VisualQRPreset } from '@/lib/visual-qr-presets';
import { normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import { computeScannability } from '@/lib/scannability';

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

export function VisualPresetCard({
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

export function VisualPresetGrid({
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
        <VisualPresetCard
          key={preset.id}
          preset={preset}
          active={highlightPresetId === preset.id}
          onSelect={() => onApply(normalizeQRStyle({ ...currentStyle, ...preset.style }))}
        />
      ))}
    </div>
  );
}
