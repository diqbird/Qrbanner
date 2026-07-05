'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';
import { STYLE_PRESETS, normalizeQRStyle, type QRStyleConfig } from '@/lib/qr-style';
import { VisualPresetPicker } from './visual-preset-picker';
import { useLanguage } from '@/components/i18n/language-provider';
import type { StyleEditorTabProps } from './style-editor-tab-props';

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
              key={preset.name}
              type="button"
              onClick={() => onStyleChange(normalizeQRStyle({ ...s, ...preset.style }))}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Foreground</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={s.fgColor}
              onChange={(e) => update({ fgColor: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded border-0"
            />
            <Input
              value={s.fgColor}
              onChange={(e) => update({ fgColor: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Background</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={s.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded border-0"
            />
            <Input
              value={s.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <Label>Transparent background (PNG export)</Label>
        <Switch checked={s.transparentBg} onCheckedChange={(v) => update({ transparentBg: v })} />
      </div>

      {s.frameStyle !== 'none' && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> {t('style.frameBackgroundGradient')}
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">{t('style.frameBackgroundGradientHint')}</p>
            </div>
            <Switch
              checked={!!s.backgroundGradientEnabled}
              onCheckedChange={(v) => update({ backgroundGradientEnabled: v })}
            />
          </div>
          {s.backgroundGradientEnabled && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={s.backgroundGradientColor2 ?? '#f5f5f7'}
                onChange={(e) => update({ backgroundGradientColor2: e.target.value })}
                className="h-9 w-9 cursor-pointer rounded border-0"
              />
              <Input
                value={s.backgroundGradientColor2 ?? '#f5f5f7'}
                onChange={(e) => update({ backgroundGradientColor2: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Gradient
          </Label>
          <Switch checked={s.gradientEnabled} onCheckedChange={(v) => update({ gradientEnabled: v })} />
        </div>
        {s.gradientEnabled && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs">Second Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={s.gradientColor2}
                  onChange={(e) => update({ gradientColor2: e.target.value })}
                  className="h-9 w-9 cursor-pointer rounded border-0"
                />
                <Input
                  value={s.gradientColor2}
                  onChange={(e) => update({ gradientColor2: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Type</Label>
              <div className="flex gap-2">
                {(['linear', 'radial'] as const).map((gradType) => (
                  <button
                    key={gradType}
                    type="button"
                    onClick={() => update({ gradientType: gradType })}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs capitalize ${
                      s.gradientType === gradType ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                    }`}
                  >
                    {gradType}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs">Rotation ({s.gradientRotation}°)</Label>
              <input
                type="range"
                min={0}
                max={360}
                value={s.gradientRotation}
                onChange={(e) => update({ gradientRotation: parseInt(e.target.value, 10) })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">Corner Square Color (optional)</Label>
          <Input
            value={s.cornerColor}
            onChange={(e) => update({ cornerColor: e.target.value })}
            placeholder={s.fgColor}
            className="font-mono text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Corner Dot Color (optional)</Label>
          <Input
            value={s.cornerDotColor}
            onChange={(e) => update({ cornerDotColor: e.target.value })}
            placeholder="Same as corners"
            className="font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}
