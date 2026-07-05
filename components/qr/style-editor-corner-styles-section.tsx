'use client';

import { Label } from '@/components/ui/label';
import { CORNER_STYLES } from '@/lib/qr-style';
import type { StyleEditorTabProps } from './style-editor-tab-props';

export function StyleEditorCornerStylesSection({ style: s, update }: StyleEditorTabProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Corner Square Style</Label>
        <div className="flex flex-wrap gap-2">
          {CORNER_STYLES.map((cs) => (
            <button
              key={cs.id}
              type="button"
              onClick={() => update({ cornerStyle: cs.id })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                s.cornerStyle === cs.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {cs.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Corner Dot Style</Label>
        <div className="flex flex-wrap gap-2">
          {CORNER_STYLES.map((cs) => (
            <button
              key={cs.id}
              type="button"
              onClick={() => update({ cornerDotStyle: cs.id })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                s.cornerDotStyle === cs.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {cs.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
