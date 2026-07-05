import type { LandingBlock, LandingBlockType } from '@/lib/landing-page';
import type { SocialPlatform } from '@/lib/landing-page';
import { newBlockId } from '@/lib/landing-blocks';

export const LANDING_SOCIAL_PLATFORMS: SocialPlatform[] = [
  'instagram',
  'facebook',
  'twitter',
  'tiktok',
  'linkedin',
  'youtube',
  'whatsapp',
  'website',
];

export const LANDING_BLOCK_ADD_ORDER: LandingBlockType[] = [
  'heading',
  'text',
  'image',
  'button',
  'hubLinks',
  'social',
  'video',
  'leadForm',
  'divider',
  'spacer',
];

export function createLandingBlock(type: LandingBlockType): LandingBlock {
  const id = newBlockId();
  switch (type) {
    case 'heading':
      return { id, type, text: '', level: 1, align: 'center' };
    case 'text':
      return { id, type, text: '', align: 'center' };
    case 'image':
      return { id, type, url: '', alt: '', rounded: true };
    case 'button':
      return { id, type, label: '', url: '', variant: 'solid' };
    case 'hubLinks':
      return { id, type, links: [{ label: '', url: '' }] };
    case 'social':
      return { id, type, links: [{ platform: 'instagram', url: '' }] };
    case 'video':
      return { id, type, url: '' };
    case 'leadForm':
      return {
        id,
        type,
        config: {
          collectName: true,
          collectEmail: true,
          collectPhone: false,
          collectMessage: false,
          requiredEmail: true,
        },
        submitLabel: '',
      };
    case 'divider':
      return { id, type };
    case 'spacer':
      return { id, type, size: 'md' };
  }
}
