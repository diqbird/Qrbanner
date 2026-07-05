'use client';

import type { LandingBlock } from '@/lib/landing-page';
import { LandingBlockFieldLayout } from './landing-block-field-layouts';

export function LandingBlockFields({
  block,
  patch,
  t,
}: {
  block: LandingBlock;
  patch: (p: Partial<LandingBlock>) => void;
  t: (key: string) => string;
}) {
  return <LandingBlockFieldLayout block={block} patch={patch} t={t} />;
}
