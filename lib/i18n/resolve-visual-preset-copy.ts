import type { VisualQRPreset } from '@/lib/visual-qr-presets';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function resolveVisualPresetName(t: TranslateFn, preset: Pick<VisualQRPreset, 'id' | 'name'>): string {
  return resolved(t, `templates.visualPresets.presets.${preset.id}.name`, preset.name);
}

export function resolveVisualPresetDescription(
  t: TranslateFn,
  preset: Pick<VisualQRPreset, 'id' | 'description'>,
): string {
  return resolved(t, `templates.visualPresets.presets.${preset.id}.description`, preset.description);
}

export function resolveVisualDesignStyle(
  t: TranslateFn,
  style: VisualQRPreset['designStyle'],
): string {
  return resolved(t, `templates.visualPresets.designStyles.${style}`, style);
}
