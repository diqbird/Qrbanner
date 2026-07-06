import type { MockupPresetId } from '@/lib/mockup-presets';
import { resolveEnumLabel, type TranslateFn } from './resolve-enum-label';

export function resolveMockupPresetLabel(t: TranslateFn, id: MockupPresetId, fallback: string): string {
  const label = resolveEnumLabel(t, 'mockup.presets', id);
  return label === id ? fallback : label;
}
