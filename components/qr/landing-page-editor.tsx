'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Layout } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLandingPageEditor } from '@/hooks/use-landing-page-editor';
import { LandingPagePreview } from './landing-page-preview';
import { LandingBlockBuilder } from './landing-block-builder';
import { LandingEditorModeToggle } from './landing-editor-mode-toggle';
import { LandingEditorTemplatePicker } from './landing-editor-template-picker';
import { LandingEditorSimpleFields } from './landing-editor-simple-fields';
import { LandingEditorAppearance } from './landing-editor-appearance';
import { LandingEditorSeoSection } from './landing-editor-seo-section';
import { LandingEditorLeadForm } from './landing-editor-lead-form';
import type { LandingPageData } from '@/lib/landing-page';

export function LandingPageEditor({
  enabled,
  onEnabledChange,
  data,
  onChange,
  qrName,
  category = 'url',
  targetUrl,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  data: LandingPageData;
  onChange: (v: LandingPageData) => void;
  qrName?: string;
  category?: string;
  targetUrl?: string;
}) {
  const { t } = useLanguage();
  const editor = useLandingPageEditor({ data, onChange, category, qrName, targetUrl });
  const { builderMode, set, qrName: name } = editor;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" /> {t('landingEditor.title')}
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">{t('landingEditor.desc')}</p>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-5">
          <LandingPagePreview data={data} qrName={name} />
          <LandingEditorModeToggle editor={editor} />

          {builderMode && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{t('landingBuilder.desc')}</p>
              <LandingBlockBuilder blocks={data.blocks ?? []} onChange={(blocks) => set({ blocks })} />
            </div>
          )}

          <LandingEditorTemplatePicker editor={editor} />
          {!builderMode && <LandingEditorSimpleFields editor={editor} />}
          <LandingEditorAppearance editor={editor} />
          <LandingEditorSeoSection editor={editor} />
          {!builderMode && <LandingEditorLeadForm editor={editor} />}
        </CardContent>
      )}
    </Card>
  );
}

export { emptyLandingPage } from '@/lib/landing-page';
export type { LandingPageData } from '@/lib/landing-page';
