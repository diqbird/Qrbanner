'use client';

import { StyleEditorDotStyleSection } from './style-editor-dot-style-section';
import { StyleEditorCornerErrorSection } from './style-editor-corner-error-section';
import type { StyleEditorTabProps } from './style-editor-tab-props';

export function StyleEditorPatternsTab({ style, update }: StyleEditorTabProps) {
  return (
    <div className="space-y-5">
      <StyleEditorDotStyleSection style={style} update={update} />
      <StyleEditorCornerErrorSection style={style} update={update} />
    </div>
  );
}
