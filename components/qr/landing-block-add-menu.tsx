'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { LandingBlock, LandingBlockType } from '@/lib/landing-page';
import { MAX_BLOCKS } from '@/lib/landing-blocks';
import { LANDING_BLOCK_ADD_ORDER } from '@/lib/landing-block-factory';
import { LANDING_BLOCK_ICONS } from '@/lib/landing-block-icons';

export function LandingBlockAddMenu({
  blockCount,
  onAdd,
}: {
  blockCount: number;
  onAdd: (type: LandingBlockType) => void;
}) {
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          disabled={blockCount >= MAX_BLOCKS}
        >
          <Plus className="h-4 w-4" />
          {blockCount >= MAX_BLOCKS ? t('landingBuilder.maxReached') : t('landingBuilder.addBlock')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {LANDING_BLOCK_ADD_ORDER.map((type) => {
          const Icon = LANDING_BLOCK_ICONS[type];
          return (
            <DropdownMenuItem key={type} onClick={() => onAdd(type)} className="gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {t(`landingBuilder.type.${type}`)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function patchLandingBlock(
  blocks: LandingBlock[],
  id: string,
  patch: Partial<LandingBlock>,
): LandingBlock[] {
  return blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as LandingBlock) : b));
}
