'use client';

import { Reorder, useDragControls } from 'framer-motion';
import {
  GripVertical, Trash2, Heading, Type, Image as ImageIcon, MousePointerClick,
  Link2, Share2, Video, ClipboardList, Minus, MoveVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LandingBlock, LandingBlockType } from '@/lib/landing-page';
import { LandingBlockFields } from './landing-block-fields';

const BLOCK_ICONS: Record<LandingBlockType, typeof Heading> = {
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

type T = (key: string) => string;

export function LandingBlockRow({
  block,
  onPatch,
  onRemove,
  t,
}: {
  block: LandingBlock;
  onPatch: (p: Partial<LandingBlock>) => void;
  onRemove: () => void;
  t: T;
}) {
  const controls = useDragControls();
  const Icon = BLOCK_ICONS[block.type];

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      className="rounded-lg border border-border/60 bg-card"
    >
      <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2">
        <button
          type="button"
          aria-label={t('landingBuilder.drag')}
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Icon className="h-4 w-4 text-primary" />
        <span className="flex-1 text-sm font-medium">{t(`landingBuilder.type.${block.type}`)}</span>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {block.type !== 'divider' && (
        <div className="p-3">
          <LandingBlockFields block={block} patch={onPatch} t={t} />
        </div>
      )}
    </Reorder.Item>
  );
}