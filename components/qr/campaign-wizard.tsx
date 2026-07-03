'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Loader2, ArrowRight, CheckCircle2, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { categoryDisplayName } from '@/lib/qr-utils';
import type { CampaignPlan, CampaignQrItem } from '@/lib/campaign-types';

type Step = 'prompt' | 'review' | 'creating' | 'done';

const EXAMPLES = {
  restaurant: {
    en: 'I am opening an Italian restaurant next Friday',
    tr: 'Önümüzdeki cuma İstanbul\'da İtalyan restoranı açıyorum',
  },
  hotel: {
    en: 'We are launching a boutique hotel with spa and room service',
    tr: 'Spa ve oda servisi olan butik bir otel açıyoruz',
  },
  event: {
    en: 'Tech conference registration opens next month',
    tr: 'Gelecek ay teknoloji konferansı kayıtları başlıyor',
  },
} as const;

function primaryFieldKey(category: string): string | null {
  if (['url', 'menu', 'pdf', 'file', 'social', 'link_hub'].includes(category)) return 'url';
  if (category === 'wifi') return 'ssid';
  if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(category)) return 'username';
  if (category === 'whatsapp') return 'phone';
  return null;
}

function primaryFieldLabel(category: string, t: (k: string) => string): string {
  if (category === 'wifi') return 'Wi‑Fi name (SSID)';
  if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(category)) return t('fields.username');
  if (category === 'whatsapp') return t('fields.whatsappNumber');
  return t('fields.urlLabel.default');
}

export function CampaignWizard() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isGuest = status === 'unauthenticated';

  const [step, setStep] = useState<Step>('prompt');
  const [prompt, setPrompt] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [plan, setPlan] = useState<CampaignPlan | null>(null);
  const [llmConfigured, setLlmConfigured] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    campaignId: string;
    created: { id: string; name: string }[];
  } | null>(null);

  const loc = locale === 'tr' ? 'tr' : 'en';

  const applyExample = (key: keyof typeof EXAMPLES) => {
    setPrompt(EXAMPLES[key][loc]);
  };

  const updateItem = useCallback((key: string, patch: Partial<CampaignQrItem>) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((it) => (it.key === key ? { ...it, ...patch } : it)),
      };
    });
  }, []);

  const updateItemData = useCallback((key: string, field: string, value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((it) =>
          it.key === key ? { ...it, qrData: { ...it.qrData, [field]: value } } : it
        ),
      };
    });
  }, []);

  const handleGenerate = async () => {
    if (prompt.trim().length < 8) {
      toast.error(t('campaign.promptTooShort'));
      return;
    }
    if (isGuest) {
      router.push(`/signup?callbackUrl=${encodeURIComponent('/qr/campaign')}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/campaign/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          locale: loc,
          businessName: businessName.trim() || undefined,
          websiteUrl: websiteUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push(`/signup?callbackUrl=${encodeURIComponent('/qr/campaign')}`);
        return;
      }
      if (res.status === 429) {
        toast.error(t('campaign.rateLimited'));
        return;
      }
      if (!res.ok) {
        toast.error(t('campaign.generateFailed'));
        return;
      }
      setPlan(data.plan);
      setLlmConfigured(Boolean(data.llmConfigured));
      setStep('review');
    } catch {
      toast.error(t('campaign.generateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!plan) return;
    const enabled = plan.items.filter((i) => i.enabled);
    if (!enabled.length) {
      toast.error(t('campaign.createFailed'));
      return;
    }

    setStep('creating');
    try {
      const res = await fetch('/api/campaign/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: { ...plan, items: enabled },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? t('campaign.createFailed'));
        setStep('review');
        return;
      }
      if (data.errors?.length) {
        toast.warning(t('campaign.partialErrors'));
      }
      setResult({
        campaignId: data.campaignId,
        created: data.created,
      });
      setStep('done');
      toast.success(t('campaign.successTitle'));
    } catch {
      toast.error(t('campaign.createFailed'));
      setStep('review');
    }
  };

  const enabledCount = plan?.items.filter((i) => i.enabled).length ?? 0;

  return (
    <div className="mx-auto max-w-[800px] space-y-8">
      <div className="text-center sm:text-left">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {t('campaign.badge')}
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('campaign.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('campaign.subtitle')}</p>
      </div>

      {isGuest && step === 'prompt' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">{t('campaign.signInRequired')}</p>
            <Button asChild size="sm">
              <Link href={`/signup?callbackUrl=${encodeURIComponent('/qr/campaign')}`}>
                {t('campaign.signIn')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'prompt' && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">{t('campaign.promptLabel')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('campaign.promptPlaceholder')}
              rows={4}
              className="resize-none"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('campaign.businessNameLabel')}</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t('campaign.businessNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('campaign.websiteLabel')}</Label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{t('campaign.examples')}</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => applyExample('restaurant')}>
                  {t('campaign.exampleRestaurant')}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyExample('hotel')}>
                  {t('campaign.exampleHotel')}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyExample('event')}>
                  {t('campaign.exampleEvent')}
                </Button>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t('campaign.generating')}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> {t('campaign.generate')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'review' && plan && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="font-display">{plan.businessName}</CardTitle>
                  <CardDescription className="mt-1">{plan.summary}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {plan.source === 'llm' ? t('campaign.sourceLlm') : t('campaign.sourceTemplate')}
                  </Badge>
                  <Badge variant="outline">
                    {t('campaign.itemsCount').replace('{count}', String(enabledCount))}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            {!llmConfigured && (
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">{t('campaign.noLlm')}</p>
              </CardContent>
            )}
          </Card>

          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold">{t('campaign.reviewTitle')}</h2>
            <p className="text-sm text-muted-foreground">{t('campaign.reviewSubtitle')}</p>
            {plan.items.map((item) => {
              const fieldKey = primaryFieldKey(item.category);
              return (
                <Card key={item.key} className={!item.enabled ? 'opacity-50' : undefined}>
                  <CardContent className="space-y-3 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.key, { name: e.target.value })}
                          className="font-medium"
                          disabled={!item.enabled}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{categoryDisplayName(item.category)}</Badge>
                          <span className="text-xs text-muted-foreground">{item.purpose}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Label htmlFor={`en-${item.key}`} className="text-xs text-muted-foreground">
                          {t('campaign.enabled')}
                        </Label>
                        <Switch
                          id={`en-${item.key}`}
                          checked={item.enabled}
                          onCheckedChange={(checked) => updateItem(item.key, { enabled: checked })}
                        />
                      </div>
                    </div>
                    {fieldKey && item.enabled && (
                      <div className="space-y-1">
                        <Label className="text-xs">{primaryFieldLabel(item.category, t)}</Label>
                        <Input
                          value={item.qrData[fieldKey] ?? ''}
                          onChange={(e) => updateItemData(item.key, fieldKey, e.target.value)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {plan.printSuggestions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-display text-base">
                  <Printer className="h-4 w-4 text-primary" />
                  {t('campaign.printIdeas')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {plan.printSuggestions.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setStep('prompt')}>
              {t('create.back')}
            </Button>
            <Button variant="outline" onClick={handleGenerate} disabled={loading}>
              {t('campaign.regenerate')}
            </Button>
            <Button onClick={handleCreate} disabled={enabledCount === 0} className="gap-2">
              {t('campaign.createAll').replace('{count}', String(enabledCount))}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 'creating' && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('campaign.creating')}</p>
        </div>
      )}

      {step === 'done' && result && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <div>
              <h2 className="font-display text-xl font-bold">{t('campaign.successTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('campaign.successSubtitle')}</p>
              <p className="mt-2 text-sm font-medium">{result.created.length} QR</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href={`/dashboard?batchId=${result.campaignId}`}>{t('campaign.viewDashboard')}</Link>
              </Button>
              {result.created[0] && (
                <Button variant="outline" asChild>
                  <Link href={`/qr/${result.created[0].id}`}>{t('campaign.editFirst')}</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
