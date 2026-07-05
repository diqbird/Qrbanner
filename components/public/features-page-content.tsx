'use client';

import {
  FeaturesPageHero,
  FeaturesPageHighlights,
  FeaturesPageVsStaticBand,
} from './features-page-sections';
import { FeaturesPageGroups, FeaturesPageBottomCta } from './features-page-groups';

export function FeaturesPageContent() {
  return (
    <>
      <FeaturesPageHero />
      <FeaturesPageHighlights />
      <FeaturesPageVsStaticBand />
      <FeaturesPageGroups />
      <FeaturesPageBottomCta />
    </>
  );
}
