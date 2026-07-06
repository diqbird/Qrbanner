'use client';

import { Button } from '@/components/ui/button';
import { Move, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { MockupPreviewState } from '@/hooks/use-mockup-preview';

export function MockupSizeToolbar({ mockup }: { mockup: MockupPreviewState }) {
  const { t } = useLanguage();
  const { placement, nudgeSize, updatePlacement } = mockup;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Move className="h-3.5 w-3.5" /> {t('mockup.dragHint')}
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">{t('mockup.qrSize')}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => nudgeSize(-2)}
          aria-label={t('mockup.decreaseSize')}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="min-w-[3rem] text-center font-mono text-sm font-medium">
          {placement.size}%
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => nudgeSize(2)}
          aria-label={t('mockup.increaseSize')}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <div className="ml-1 flex gap-1 border-l border-border/60 pl-2">
          {[
            { label: 'S', size: 12 },
            { label: 'M', size: 22 },
            { label: 'L', size: 35 },
          ].map((sizePreset) => (
            <Button
              key={sizePreset.label}
              type="button"
              variant={Math.abs(placement.size - sizePreset.size) < 2 ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => updatePlacement({ size: sizePreset.size })}
            >
              {sizePreset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
