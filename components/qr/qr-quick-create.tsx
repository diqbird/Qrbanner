'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { QRPreview } from './qr-preview';
import { DEFAULT_QR_STYLE } from './qr-style-editor';
import { normalizeQRStyle } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress';
import { onboardingQrUrl } from '@/lib/onboarding';

function normalizeUrlInput(raw: string): string {
  const t = raw.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export function QRQuickCreate({
  onAdvanced,
  onboarding = false,
}: {
  onAdvanced: (data: { url: string; name: string; style: ReturnType<typeof normalizeQRStyle> }) => void;
  onboarding?: boolean;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session } = useSession();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [style, setStyle] = useState(DEFAULT_QR_STYLE);
  const [saving, setSaving] = useState(false);

  const normalizedUrl = normalizeUrlInput(url);
  const isValid = normalizedUrl.length > 10 && normalizedUrl.includes('.');

  useEffect(() => {
    if (!onboarding) return;
    document.getElementById('quick-url')?.focus();
  }, [onboarding]);

  const handleSave = async () => {
    if (!isValid) {
      toast.error(t('quick.invalidUrl'));
      return;
    }
    if (!session?.user) {
      router.push(`/signup?callbackUrl=${encodeURIComponent('/qr/create?quick=1')}`);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || t('quick.namePlaceholder'),
          category: 'url',
          qrData: { url: normalizedUrl },
          style: normalizeQRStyle(style),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('create.createFailed'));
        return;
      }
      toast.success(t('quick.saved'));
      router.push(onboarding ? onboardingQrUrl(data.qrCode.id) : `/qr/${data.qrCode.id}`);
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {onboarding && <OnboardingProgress step={saving ? 2 : 1} />}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Zap className="h-3.5 w-3.5" />
          {t('hero.createQrHint')}
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {onboarding ? t('onboarding.quickTitle') : t('quick.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {onboarding ? t('onboarding.quickSubtitle') : t('quick.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">{t('quick.urlLabel')}</CardTitle>
            <CardDescription>{t('create.steps.content')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quick-url">{t('quick.urlLabel')}</Label>
              <Input
                id="quick-url"
                type="url"
                inputMode="url"
                placeholder={t('quick.urlPlaceholder')}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-name">{t('quick.nameLabel')}</Label>
              <Input
                id="quick-name"
                placeholder={t('quick.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              {session?.user ? (
                <Button
                  type="button"
                  className="w-full gap-2"
                  disabled={!isValid || saving}
                  onClick={handleSave}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 shrink-0" />
                  )}
                  {saving ? t('quick.saving') : t('quick.saveToDashboard')}
                </Button>
              ) : (
                <Button type="button" className="w-full gap-2" asChild>
                  <Link href={`/signup?callbackUrl=${encodeURIComponent('/qr/create?quick=1')}`}>
                    <Save className="h-4 w-4 shrink-0" />
                    {t('quick.signUpToSave')}
                  </Link>
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="h-auto w-full gap-2 whitespace-normal px-4 py-2.5 text-sm leading-snug"
                onClick={() => {
                  if (isValid) {
                    onAdvanced({ url: normalizedUrl, name, style: normalizeQRStyle(style) });
                  } else {
                    onAdvanced({ url: '', name: '', style: normalizeQRStyle(style) });
                  }
                }}
              >
                <span className="min-w-0 flex-1 text-center">{t('quick.advancedEditor')}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Button>
            </div>
            {!isValid && url.trim().length > 3 && (
              <p className="text-xs text-amber-700 dark:text-amber-300">{t('quick.invalidUrl')}</p>
            )}
          </CardContent>
        </Card>

        <QRPreview
          category="url"
          qrData={{ url: isValid ? normalizedUrl : 'https://qrbanner.com' }}
          style={style}
          logoPreview={null}
          qrName={name || undefined}
          onStyleChange={(next) => setStyle(normalizeQRStyle(next))}
        />
      </div>
    </div>
  );
}
