'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Image as ImageIcon, Frame, Sparkles } from 'lucide-react';
import {
  type QRStyleConfig,
  DOT_STYLES,
  CORNER_STYLES,
  FRAME_STYLES,
  FRAME_TEXT_PRESETS,
  ERROR_LEVELS,
  STYLE_PRESETS,
  DEFAULT_QR_STYLE,
  normalizeQRStyle,
} from '@/lib/qr-style';
import { StyleTemplateLibrary } from './style-template-library';
import { VisualPresetPicker, findMatchingVisualPresetId } from './visual-preset-picker';
import { FrameLabelSettings } from './frame-label-settings';
import { useLanguage } from '@/components/i18n/language-provider';

function DotPreview({ type, active }: { type: string; active: boolean }) {
  const cells = [
    [1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1],
    [1, 0, 1, 1, 1],
  ];
  return (
    <div
      className={`grid grid-cols-5 gap-[2px] p-1.5 rounded-md ${
        active ? 'bg-primary/15 ring-2 ring-primary' : 'bg-muted/60'
      }`}
    >
      {cells.flat().map((on, i) => {
        const rounded =
          type === 'rounded' || type === 'extra-rounded' || type === 'classy-rounded'
            ? 'rounded-full'
            : type === 'dots'
              ? 'rounded-full scale-75'
              : type === 'classy' || type === 'classy-rounded'
                ? 'rounded-sm'
                : 'rounded-none';
        return (
          <div
            key={i}
            className={`h-2 w-2 ${rounded} ${on ? 'bg-foreground' : 'bg-transparent'}`}
          />
        );
      })}
    </div>
  );
}

export function QRStyleEditor({
  style,
  onStyleChange,
  onLogoChange,
  logoPreview,
  logoPath,
  onTemplateLogoApply,
  highlightVisualPresetId,
}: {
  style: Partial<QRStyleConfig>;
  onStyleChange: (style: QRStyleConfig) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoPreview: string | null;
  logoPath?: string | null;
  onTemplateLogoApply?: (path: string | null) => void;
  highlightVisualPresetId?: string;
}) {
  const { t } = useLanguage();
  const s = normalizeQRStyle(style);
  const activeVisualPreset = highlightVisualPresetId ?? findMatchingVisualPresetId(s);

  const update = (patch: Partial<QRStyleConfig>) => {
    onStyleChange({ ...s, ...patch });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" /> {t('style.customizeTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FrameLabelSettings style={s} onChange={update} inlineEdit />

        <Tabs defaultValue="colors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">{t('style.tabColors')}</TabsTrigger>
            <TabsTrigger value="patterns">{t('style.tabPatterns')}</TabsTrigger>
            <TabsTrigger value="frame">{t('style.tabFrame')}</TabsTrigger>
            <TabsTrigger value="logo">{t('style.tabLogo')}</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-5">
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
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors"
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
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> {t('style.frameBackgroundGradient')}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">{t('style.frameBackgroundGradientHint')}</p>
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

            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Gradient
                </Label>
                <Switch
                  checked={s.gradientEnabled}
                  onCheckedChange={(v) => update({ gradientEnabled: v })}
                />
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
                      {(['linear', 'radial'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update({ gradientType: t })}
                          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs capitalize ${
                            s.gradientType === t ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                          }`}
                        >
                          {t}
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
          </TabsContent>

          <TabsContent value="patterns" className="space-y-5">
            <div className="space-y-2">
              <Label>Dot Style</Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {DOT_STYLES.map((ds) => (
                  <button
                    key={ds.id}
                    type="button"
                    onClick={() => update({ dotStyle: ds.id })}
                    className="flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all hover:border-primary/50"
                  >
                    <DotPreview type={ds.id} active={s.dotStyle === ds.id} />
                    <span className="text-[10px] font-medium leading-tight text-center">{ds.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Corner Square Style</Label>
              <div className="flex flex-wrap gap-2">
                {CORNER_STYLES.map((cs) => (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => update({ cornerStyle: cs.id })}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                      s.cornerStyle === cs.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {cs.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Corner Dot Style</Label>
              <div className="flex flex-wrap gap-2">
                {CORNER_STYLES.map((cs) => (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => update({ cornerDotStyle: cs.id })}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                      s.cornerDotStyle === cs.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {cs.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Error Correction</Label>
              <div className="flex gap-2">
                {ERROR_LEVELS.map((ec) => (
                  <button
                    key={ec}
                    type="button"
                    onClick={() => update({ errorCorrection: ec })}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                      s.errorCorrection === ec
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {ec}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Use H when adding a logo. Higher levels tolerate more damage before becoming unreadable.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('style.quietZone')}</Label>
                <span className="font-mono text-xs text-muted-foreground">{s.margin}</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={s.margin}
                onChange={(e) => update({ margin: parseInt(e.target.value, 10) })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                White space around the QR pattern. Increase for print or busy backgrounds (4–8 recommended).
              </p>
            </div>
          </TabsContent>

          <TabsContent value="frame" className="space-y-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Frame className="h-4 w-4" /> Frame Style
              </Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {FRAME_STYLES.map((fs) => (
                  <button
                    key={fs.id}
                    type="button"
                    onClick={() => update({ frameStyle: fs.id })}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      s.frameStyle === fs.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="text-sm font-medium">{fs.label}</p>
                    <p className="text-xs text-muted-foreground">{fs.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {s.frameStyle !== 'none' && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Frame Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={s.frameColor}
                        onChange={(e) => update({ frameColor: e.target.value })}
                        className="h-10 w-10 cursor-pointer rounded border-0"
                      />
                      <Input
                        value={s.frameColor}
                        onChange={(e) => update({ frameColor: e.target.value })}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={s.frameTextColor}
                        onChange={(e) => update({ frameTextColor: e.target.value })}
                        className="h-10 w-10 cursor-pointer rounded border-0"
                      />
                      <Input
                        value={s.frameTextColor}
                        onChange={(e) => update({ frameTextColor: e.target.value })}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logo" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Logo / Image Overlay
              </Label>
              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <ImageIcon className="h-4 w-4" />
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  <input type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
                </label>
                {logoPreview && (
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg border">
                    <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Center logo with automatic padding. Set error correction to H for best scan reliability.
              </p>
              <div className="space-y-2">
                <Label className="text-xs">Logo size ({Math.round((s.logoSize ?? 0.22) * 100)}%)</Label>
                <input
                  type="range"
                  min={0.1}
                  max={0.35}
                  step={0.01}
                  value={s.logoSize ?? 0.22}
                  onChange={(e) => update({ logoSize: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
              {logoPreview && s.errorCorrection !== 'H' && (
                <button
                  type="button"
                  onClick={() => update({ errorCorrection: 'H' })}
                  className="text-xs text-primary hover:underline"
                >
                  Switch to error correction H (recommended with logo)
                </button>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <StyleTemplateLibrary
          currentStyle={s}
          logoPath={logoPath ?? null}
          onApply={(appliedStyle, path) => {
            onStyleChange(appliedStyle);
            if (path && onTemplateLogoApply) onTemplateLogoApply(path);
          }}
        />
      </CardContent>
    </Card>
  );
}

export { DEFAULT_QR_STYLE, normalizeQRStyle };
export type { QRStyleConfig };
