import {
  Heading,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Link2,
  Share2,
  Video,
  ClipboardList,
  Minus,
  MoveVertical,
} from 'lucide-react';
import type { LandingBlockType } from '@/lib/landing-page';

export const LANDING_BLOCK_ICONS: Record<LandingBlockType, typeof Heading> = {
  heading: Heading,
  text: Type,
  image: ImageIcon,
  button: MousePointerClick,
  hubLinks: Link2,
  social: Share2,
  video: Video,
  leadForm: ClipboardList,
  divider: Minus,
  spacer: MoveVertical,
};
