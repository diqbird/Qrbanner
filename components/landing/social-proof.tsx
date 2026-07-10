import { getPublicPlatformStats, shouldDisplayPublicStats } from '@/lib/public-stats';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { formatFreePlanDynamicQrShortLabel } from '@/lib/i18n/dynamic-qr-label';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { Shield, Zap, CheckCircle2 } from 'lucide-react';

const INDUSTRY_KEYS = [
  'socialProof.industryRestaurant',
  'socialProof.industryEvents',
  'socialProof.industryRetail',
  'socialProof.industryMarketing',
  'socialProof.industryHospitality',
] as const;

const TRUST_PILLAR_KEYS = [
  'socialProof.trustPillar1',
  'socialProof.trustPillar2',
  'socialProof.trustPillar3',
] as const;

export async function LandingSocialProof() {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const stats = await getPublicPlatformStats();
  const showStats = shouldDisplayPublicStats(stats);
  const qrLabel = formatFreePlanDynamicQrShortLabel(locale);

  return (
    <section className="border-y border-border/40 bg-muted/20 py-12 sm:py-16" aria-label={t('socialProof.sectionLabel')}>
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        {showStats ? (
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: stats.qrCodes, label: t('socialProof.statQrCodes') },
              { value: stats.scans, label: t('socialProof.statScans') },
              { value: stats.users, label: t('socialProof.statUsers') },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border/50 bg-card/80 px-6 py-5 text-center shadow-sm"
              >
                <p className="font-display text-3xl font-bold tracking-tight text-foreground">
                  {formatLocaleNumber(item.value, locale)}+
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TRUST_PILLAR_KEYS.map((key) => (
              <div
                key={key}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-5 py-4 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-foreground" aria-hidden />
                <p className="text-sm font-medium text-foreground">{t(key, key === 'socialProof.trustPillar1' ? { qrLabel } : undefined)}</p>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('socialProof.trustedBy')}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {INDUSTRY_KEYS.map((key) => (
            <span
              key={key}
              className="rounded-full border border-border/60 bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground"
            >
              {t(key)}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Shield className="h-4 w-4 text-foreground" aria-hidden />
            {t('landing.trust4')}
          </span>
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-foreground" aria-hidden />
            {t('landing.trust2')}
          </span>
        </div>
      </div>
    </section>
  );
}
