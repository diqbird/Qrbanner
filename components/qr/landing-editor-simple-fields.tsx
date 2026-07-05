'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LandingPageEditorState } from '@/hooks/use-landing-page-editor';

type LandingEditorSimpleFieldsProps = {
  editor: LandingPageEditorState;
};

export function LandingEditorSimpleFields({ editor }: LandingEditorSimpleFieldsProps) {
  const { t, data, set, qrName } = editor;

  return (
    <>
      <div className="space-y-2">
        <Label>{t('landingEditor.pageTitle')}</Label>
        <Input
          placeholder={qrName || t('landingEditor.titlePlaceholder')}
          value={data.title}
          onChange={(e) => set({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('landingEditor.pageSubtitle')}</Label>
        <Textarea
          placeholder={t('landingEditor.subtitlePlaceholder')}
          value={data.subtitle}
          onChange={(e) => set({ subtitle: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('landingEditor.buttonLabel')}</Label>
        <Input
          placeholder={t('landingEditor.ctaPlaceholder')}
          value={data.ctaLabel}
          onChange={(e) => set({ ctaLabel: e.target.value })}
        />
      </div>
    </>
  );
}
