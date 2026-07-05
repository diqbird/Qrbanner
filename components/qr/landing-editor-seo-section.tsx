'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { LandingPageEditorState } from '@/hooks/use-landing-page-editor';

type LandingEditorSeoSectionProps = {
  editor: LandingPageEditorState;
};

export function LandingEditorSeoSection({ editor }: LandingEditorSeoSectionProps) {
  const { t, data, set, qrName } = editor;

  return (
    <div className="rounded-lg border border-dashed border-border/60 p-4 space-y-4">
      <p className="text-sm font-medium">{t('landingEditor.seoSection')}</p>
      <p className="text-xs text-muted-foreground">{t('landingEditor.seoDesc')}</p>
      <div className="space-y-2">
        <Label>{t('landingEditor.metaTitle')}</Label>
        <Input
          placeholder={data.title || qrName || t('landingEditor.metaTitlePlaceholder')}
          value={data.seo?.metaTitle ?? ''}
          onChange={(e) => set({ seo: { ...data.seo, metaTitle: e.target.value } })}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('landingEditor.metaDescription')}</Label>
        <Textarea
          placeholder={data.subtitle || t('landingEditor.metaDescPlaceholder')}
          value={data.seo?.metaDescription ?? ''}
          onChange={(e) => set({ seo: { ...data.seo, metaDescription: e.target.value } })}
          rows={2}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('landingEditor.ogImage')}</Label>
          <Input
            placeholder={t('landingEditor.ogImagePlaceholder')}
            value={data.seo?.ogImage ?? ''}
            onChange={(e) => set({ seo: { ...data.seo, ogImage: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('landingEditor.favicon')}</Label>
          <Input
            placeholder={t('landingEditor.faviconPlaceholder')}
            value={data.seo?.faviconUrl ?? ''}
            onChange={(e) => set({ seo: { ...data.seo, faviconUrl: e.target.value } })}
          />
        </div>
      </div>
      <label className="flex items-center justify-between gap-3 text-sm">
        <span>
          {t('landingEditor.indexable')}
          <span className="block text-xs text-muted-foreground">{t('landingEditor.indexableHint')}</span>
        </span>
        <Switch
          checked={Boolean(data.seo?.indexable)}
          onCheckedChange={(v) => set({ seo: { ...data.seo, indexable: v } })}
        />
      </label>
    </div>
  );
}
