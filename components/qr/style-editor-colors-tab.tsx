'use client';

import { Label } from '@/components/ui/label';
import { STYLE_PRESETS, normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import { VisualPresetPicker } from './visual-preset-picker';
import { useLanguage } from '@/components/i18n/language-provider';
import type { StyleEditorTabProps } from './style-editor-tab-props';
import { StyleEditorFgBgFields } from './style-editor-color-fields';
import { StyleEditorGradientPanel } from './style-editor-gradient-panel';

type StyleEditorColorsTabProps = StyleEditorTabProps & {
  activeVisualPreset?: string;
  onStyleChange: (style: QRStyleConfig) => void;
};

export function StyleEditorColorsTab({
  style: s,
  update,
  activeVisualPreset,
  onStyleChange,
}: StyleEditorColorsTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <VisualPresetPicker
        currentStyle={s}
        highlightPresetId={activeVisualPreset}
        onApply={onStyleChange}
      />

      <div className="space-y-2">
        <Label>{t('style.stylePresets')}</Label>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onStyleChange(normalizeQRStyle({ ...s, ...preset.style }))}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              {t(`style.colorPresets.${preset.id}`)}
            </button>
          ))}
        </div>
      </div>

      <StyleEditorFgBgFields style={s} update={update} />
      <StyleEditorGradientPanel style={s} update={update} />
    </div>
  );
}
