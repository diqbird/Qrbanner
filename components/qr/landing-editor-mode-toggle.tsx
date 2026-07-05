'use client';

import { Button } from '@/components/ui/button';
import { Blocks, LayoutTemplate, Sparkles } from 'lucide-react';
import type { LandingPageEditorState } from '@/hooks/use-landing-page-editor';

type LandingEditorModeToggleProps = {
  editor: LandingPageEditorState;
};

export function LandingEditorModeToggle({ editor }: LandingEditorModeToggleProps) {
  const { t, builderMode, set, enableBuilder, aiLoading, handleAiGenerate } = editor;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex rounded-lg border border-border/60 p-0.5">
        <button
          type="button"
          onClick={() => set({ builderMode: false })}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            !builderMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutTemplate className="h-4 w-4" />
          {t('landingBuilder.modeSimple')}
        </button>
        <button
          type="button"
          onClick={enableBuilder}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            builderMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Blocks className="h-4 w-4" />
          {t('landingBuilder.modeBuilder')}
        </button>
      </div>
      {!builderMode && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          loading={aiLoading}
          onClick={handleAiGenerate}
        >
          <Sparkles className="h-4 w-4" />
          {t('landingEditor.aiGenerate')}
        </Button>
      )}
    </div>
  );
}
