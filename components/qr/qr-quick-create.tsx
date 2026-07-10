'use client';

import { Zap } from 'lucide-react';
import { QRPreview } from './qr-preview';
import { QrQuickCreateForm } from './qr-quick-create-form';
import { useQrQuickCreate } from '@/hooks/use-qr-quick-create';
import { normalizeQRStyle } from '@/lib/qr-style';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatFreePlanDynamicQrShortLabel } from '@/lib/i18n/dynamic-qr-label';
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress';
import type { QRStyleConfig } from '@/lib/qr-style';

export function QRQuickCreate({
  onAdvanced,
  onboarding = false,
}: {
  onAdvanced: (data: { url: string; name: string; style: QRStyleConfig }) => void;
  onboarding?: boolean;
}) {
  const { t, locale } = useLanguage();
  const quick = useQrQuickCreate(onboarding);
  const { isValid, normalizedUrl, name, style, setStyle, saving, goAdvanced } = quick;

  return (
    <div className="space-y-6">
      {onboarding && <OnboardingProgress step={saving ? 2 : 1} />}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Zap className="h-3.5 w-3.5" />
          {t('hero.createQrHint', { qrLabel: formatFreePlanDynamicQrShortLabel(locale) })}
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {onboarding ? t('onboarding.quickTitle') : t('quick.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {onboarding ? t('onboarding.quickSubtitle') : t('quick.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QrQuickCreateForm quick={quick} onAdvanced={() => goAdvanced(onAdvanced)} />
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
