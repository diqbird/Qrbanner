import type { LandingBlock } from '@/lib/landing-page';

export type LandingBlockFieldProps = {
  block: LandingBlock;
  patch: (p: Partial<LandingBlock>) => void;
  t: (key: string) => string;
};
