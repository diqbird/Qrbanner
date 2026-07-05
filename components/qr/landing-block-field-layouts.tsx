'use client';

import type { LandingBlockFieldProps } from './landing-block-field-types';
import {
  LandingBlockHeadingLayout,
  LandingBlockTextLayout,
  LandingBlockSpacerLayout,
  LandingBlockDividerLayout,
} from './landing-block-layouts-content';
import {
  LandingBlockImageLayout,
  LandingBlockVideoLayout,
  LandingBlockButtonLayout,
} from './landing-block-layouts-media';
import {
  LandingBlockHubLinksLayout,
  LandingBlockSocialLayout,
} from './landing-block-layouts-links';
import { LandingBlockLeadFormLayout } from './landing-block-layouts-form';

export function LandingBlockFieldLayout(props: LandingBlockFieldProps) {
  switch (props.block.type) {
    case 'heading':
      return <LandingBlockHeadingLayout {...props} />;
    case 'text':
      return <LandingBlockTextLayout {...props} />;
    case 'image':
      return <LandingBlockImageLayout {...props} />;
    case 'button':
      return <LandingBlockButtonLayout {...props} />;
    case 'hubLinks':
      return <LandingBlockHubLinksLayout {...props} />;
    case 'social':
      return <LandingBlockSocialLayout {...props} />;
    case 'video':
      return <LandingBlockVideoLayout {...props} />;
    case 'leadForm':
      return <LandingBlockLeadFormLayout {...props} />;
    case 'spacer':
      return <LandingBlockSpacerLayout {...props} />;
    case 'divider':
      return <LandingBlockDividerLayout {...props} />;
  }
}
