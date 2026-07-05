'use client';

import { StyleEditorCornerStylesSection } from './style-editor-corner-styles-section';
import { StyleEditorErrorMarginSection } from './style-editor-error-margin-section';
import type { StyleEditorTabProps } from './style-editor-tab-props';

export function StyleEditorCornerErrorSection(props: StyleEditorTabProps) {
  return (
    <>
      <StyleEditorCornerStylesSection {...props} />
      <StyleEditorErrorMarginSection {...props} />
    </>
  );
}
