'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Layout, ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import {
  resolveLandingTemplateDescription,
  resolveLandingTemplateName,
} from '@/lib/i18n/resolve-landing-copy';
import { LandingPagePreview } from './landing-page-preview';
import {
  LandingPageData,
  emptyLandingPage,
  LANDING_TEMPLATES,
  LandingTemplate,
  defaultLeadForm,
  type LeadFormConfig,
} from '@/lib/landing-page';

const LEAD_FIELD_KEYS = [
  ['collectName', 'landingEditor.fieldName'],
  ['collectEmail', 'landingEditor.fieldEmail'],
  ['collectPhone', 'landingEditor.fieldPhone'],
  ['collectMessage', 'landingEditor.fieldMessage'],
] as const;

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
  const { t, locale } = useLanguage();
  const [aiLoading, setAiLoading] = useState(false);
  const set = (patch: Partial<LandingPageData>) => onChange({ ...data, ...patch });

  const handleAiGenerate = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/landing-page/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category ?? 'url',
          qrName,
          targetUrl,
          locale: locale === 'tr' ? 'tr' : 'en',
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        toast.error(resolveApiError(t, payload.error, 'landingEditor.aiFailed'));
        return;
      }
      onChange({ ...data, ...(payload.copy ?? {}) });
      if (payload.source === 'llm') {
        toast.success(t('landingEditor.aiGenerated'));
      } else {
        toast.message(t('landingEditor.aiTemplateFallback'));
      }
    } catch {
      toast.error(t('landingEditor.aiFailed'));
    } finally {
      setAiLoading(false);
    }
  };

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
          <LandingPagePreview data={data} qrName={qrName} />
          <div className="flex justify-end">
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
          </div>
          <div className="space-y-2">
            <Label>{t('landingEditor.template')}</Label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {LANDING_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => set({ template: tpl.id as LandingTemplate })}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    data.template === tpl.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  <p className="text-sm font-medium">{resolveLandingTemplateName(t, tpl.id, tpl.name)}</p>
                  <p className="text-xs text-muted-foreground">
                    {resolveLandingTemplateDescription(t, tpl.id, tpl.description)}
                  </p>
                </button>
              ))}
            </div>
          </div>

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

          <div className="space-y-2">
            <Label>{t('landingEditor.buttonLabel')}</Label>
            <Input
              placeholder={t('landingEditor.ctaPlaceholder')}
              value={data.ctaLabel}
              onChange={(e) => set({ ctaLabel: e.target.value })}
            />
          </div>

          <div className="rounded-lg border border-dashed border-border/60 p-4 space-y-4">
            <p className="text-sm font-medium">{t('landingEditor.seoSection')}</p>
            <p className="text-xs text-muted-foreground">{t('landingEditor.seoDesc')}</p>
            <div className="space-y-2">
              <Label>{t('landingEditor.metaTitle')}</Label>
              <Input
                placeholder={data.title || qrName || t('landingEditor.metaTitlePlaceholder')}
                value={data.seo?.metaTitle ?? ''}
                onChange={(e) =>
                  set({ seo: { ...data.seo, metaTitle: e.target.value } })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t('landingEditor.metaDescription')}</Label>
              <Textarea
                placeholder={data.subtitle || t('landingEditor.metaDescPlaceholder')}
                value={data.seo?.metaDescription ?? ''}
                onChange={(e) =>
                  set({ seo: { ...data.seo, metaDescription: e.target.value } })
                }
                rows={2}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('landingEditor.ogImage')}</Label>
                <Input
                  placeholder={t('landingEditor.ogImagePlaceholder')}
                  value={data.seo?.ogImage ?? ''}
                  onChange={(e) =>
                    set({ seo: { ...data.seo, ogImage: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t('landingEditor.favicon')}</Label>
                <Input
                  placeholder={t('landingEditor.faviconPlaceholder')}
                  value={data.seo?.faviconUrl ?? ''}
                  onChange={(e) =>
                    set({ seo: { ...data.seo, faviconUrl: e.target.value } })
                  }
                />
              </div>
            </div>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>
                {t('landingEditor.indexable')}
                <span className="block text-xs text-muted-foreground">
                  {t('landingEditor.indexableHint')}
                </span>
              </span>
              <Switch
                checked={Boolean(data.seo?.indexable)}
                onCheckedChange={(v) =>
                  set({ seo: { ...data.seo, indexable: v } })
                }
              />
            </label>
          </div>

          <div className="rounded-lg border border-border/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('landingEditor.leadFormTitle')}</p>
                <p className="text-xs text-muted-foreground">{t('landingEditor.leadFormDesc')}</p>
              </div>
              <Switch
                checked={Boolean(data.leadFormEnabled)}
                onCheckedChange={(v) =>
                  set({
                    leadFormEnabled: v,
                    leadForm: data.leadForm ?? defaultLeadForm,
                  })
                }
              />
            </div>
            {data.leadFormEnabled && (
              <div className="grid gap-3 sm:grid-cols-2">
                {LEAD_FIELD_KEYS.map(([key, labelKey]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={Boolean((data.leadForm ?? defaultLeadForm)[key])}
                      onCheckedChange={(v) =>
                        set({
                          leadForm: {
                            ...(data.leadForm ?? defaultLeadForm),
                            [key]: v,
                          } as LeadFormConfig,
                        })
                      }
                    />
                    {t(labelKey)}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <Switch
                    checked={Boolean((data.leadForm ?? defaultLeadForm).requiredEmail)}
                    onCheckedChange={(v) =>
                      set({
                        leadForm: {
                          ...(data.leadForm ?? defaultLeadForm),
                          requiredEmail: v,
                        },
                      })
                    }
                  />
                  {t('landingEditor.requireEmail')}
                </label>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export { emptyLandingPage };
export type { LandingPageData };
