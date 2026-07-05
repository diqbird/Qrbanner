'use client';

import { Reorder } from 'framer-motion';
import { Plus, Heading, Type, Image as ImageIcon, MousePointerClick, Link2, Share2, Video, ClipboardList, Minus, MoveVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/components/i18n/language-provider';
import type { LandingBlock, LandingBlockType } from '@/lib/landing-page';
import { MAX_BLOCKS } from '@/lib/landing-blocks';
import { createLandingBlock, LANDING_BLOCK_ADD_ORDER } from '@/lib/landing-block-factory';
import { LandingBlockRow } from './landing-block-row';

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

export function LandingBlockBuilder({
  blocks,
  onChange,
}: {
  blocks: LandingBlock[];
  onChange: (blocks: LandingBlock[]) => void;
}) {
  const { t } = useLanguage();
  const list = blocks ?? [];

  const patchBlock = (id: string, p: Partial<LandingBlock>) =>
    onChange(list.map((b) => (b.id === id ? ({ ...b, ...p } as LandingBlock) : b)));

  const removeBlock = (id: string) => onChange(list.filter((b) => b.id !== id));

  const addBlock = (type: LandingBlockType) => {
    if (list.length >= MAX_BLOCKS) return;
    onChange([...list, createLandingBlock(type)]);
  };

  return (
    <div className="space-y-3">
      {list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 p-6 text-center">
          <p className="text-sm text-muted-foreground">{t('landingBuilder.empty')}</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={list} onReorder={onChange} className="space-y-3">
          {list.map((block) => (
            <LandingBlockRow
              key={block.id}
              block={block}
              onPatch={(p) => patchBlock(block.id, p)}
              onRemove={() => removeBlock(block.id)}
              t={t}
            />
          ))}
        </Reorder.Group>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={list.length >= MAX_BLOCKS}
          >
            <Plus className="h-4 w-4" />
            {list.length >= MAX_BLOCKS ? t('landingBuilder.maxReached') : t('landingBuilder.addBlock')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {LANDING_BLOCK_ADD_ORDER.map((type) => {
            const Icon = BLOCK_ICONS[type];
            return (
              <DropdownMenuItem key={type} onClick={() => addBlock(type)} className="gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {t(`landingBuilder.type.${type}`)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
