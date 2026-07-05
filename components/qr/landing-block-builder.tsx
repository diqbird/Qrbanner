'use client';

import { Reorder } from 'framer-motion';
import { useLanguage } from '@/components/i18n/language-provider';
import type { LandingBlock, LandingBlockType } from '@/lib/landing-page';
import { MAX_BLOCKS } from '@/lib/landing-blocks';
import { createLandingBlock } from '@/lib/landing-block-factory';
import { LandingBlockRow } from './landing-block-row';
import { LandingBlockAddMenu, patchLandingBlock } from './landing-block-add-menu';

export function LandingBlockBuilder({
  blocks,
  onChange,
}: {
  blocks: LandingBlock[];
  onChange: (blocks: LandingBlock[]) => void;
}) {
  const { t } = useLanguage();
  const list = blocks ?? [];

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
              onPatch={(p) => onChange(patchLandingBlock(list, block.id, p))}
              onRemove={() => removeBlock(block.id)}
              t={t}
            />
          ))}
        </Reorder.Group>
      )}

      <LandingBlockAddMenu blockCount={list.length} onAdd={addBlock} />
    </div>
  );
}
