'use client';

import type { ReactNode } from 'react';
import { PremiumShell } from './primitives';

type Narrow = '3xl' | '4xl' | '5xl' | '800' | '1080' | '1200' | 'full';

const NARROW_CLASS: Record<Narrow, string> = {
  '3xl': 'mx-auto max-w-3xl',
  '4xl': 'mx-auto max-w-4xl',
  '5xl': 'mx-auto max-w-5xl',
  '800': 'mx-auto max-w-[800px]',
  '1080': 'mx-auto max-w-[1080px]',
  '1200': 'mx-auto max-w-[1200px]',
  full: '',
};

/** Shared PremiumShell + ph-container frame for marketing hubs. */
export function PremiumPageFrame({
  children,
  narrow = 'full',
}: {
  children: ReactNode;
  narrow?: Narrow;
}) {
  const inner = NARROW_CLASS[narrow];
  return (
    <PremiumShell>
      <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
        {inner ? <div className={inner}>{children}</div> : children}
      </div>
    </PremiumShell>
  );
}
