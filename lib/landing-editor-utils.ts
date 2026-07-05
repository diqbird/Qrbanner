import { newBlockId } from '@/lib/landing-blocks';
import type { LandingBlock, LandingPageData } from '@/lib/landing-page';

export const LEAD_FIELD_KEYS = [
  ['collectName', 'landingEditor.fieldName'],
  ['collectEmail', 'landingEditor.fieldEmail'],
  ['collectPhone', 'landingEditor.fieldPhone'],
  ['collectMessage', 'landingEditor.fieldMessage'],
] as const;

export function seedBuilderBlocksFromClassic(data: LandingPageData): LandingBlock[] {
  const seeded: LandingBlock[] = [];
  if (data.title?.trim()) {
    seeded.push({ id: newBlockId(), type: 'heading', text: data.title, level: 1, align: 'center' });
  }
  if (data.subtitle?.trim()) {
    seeded.push({ id: newBlockId(), type: 'text', text: data.subtitle, align: 'center' });
  }
  if (data.ctaLabel?.trim()) {
    seeded.push({ id: newBlockId(), type: 'button', label: data.ctaLabel, url: '', variant: 'solid' });
  }
  return seeded;
}
