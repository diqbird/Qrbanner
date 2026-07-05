'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon } from 'lucide-react';
import type { LandingPageEditorState } from '@/hooks/use-landing-page-editor';

type LandingEditorAppearanceProps = {
  editor: LandingPageEditorState;
};

export function LandingEditorAppearance({ editor }: LandingEditorAppearanceProps) {
  const { t, data, set } = editor;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> {t('landingEditor.bannerImage')}
        </Label>
        <Input
          placeholder={t('landingEditor.bannerPlaceholder')}
          value={data.bannerImage}
          onChange={(e) => set({ bannerImage: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">{t('landingEditor.bannerHint')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('landingEditor.accentColor')}</Label>
        <div className="flex gap-2">
          <input
            type="color"
            value={data.accentColor}
            onChange={(e) => set({ accentColor: e.target.value })}
            className="h-10 w-12 cursor-pointer rounded border"
          />
          <Input
            value={data.accentColor}
            onChange={(e) => set({ accentColor: e.target.value })}
            className="font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}
