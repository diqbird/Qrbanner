import { getPublicPlatformStats, shouldDisplayPublicStats } from '@/lib/public-stats';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { formatFreePlanDynamicQrShortLabel } from '@/lib/i18n/dynamic-qr-label';
import { PremiumStatsClient } from './stats-client';
import { Reveal } from './primitives';

/** Soft trust strip when live counts are still below display thresholds — no fake numbers. */
async function PremiumStatsFallback() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const pills = [
    formatFreePlanDynamicQrShortLabel(locale),
    t('hero.trustApi'),
    t('hero.trustCancel'),
  ];

  return (
    <section className="py-14 sm:py-16" aria-labelledby="premium-stats-fallback-heading">
      <div className="ph-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="premium-stats-fallback-heading" className="ph-title text-3xl sm:text-4xl">
            {t('premiumHome.stats.title')}
          </h2>
          <p className="mt-3 text-muted-foreground">{t('premiumHome.stats.subtitle')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {pills.map((label) => (
              <span
                key={label}
                className="rounded-full border border-border/80 bg-card px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm"
              >
                {label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export async function PremiumStats() {
  const stats = await getPublicPlatformStats();
  if (!shouldDisplayPublicStats(stats)) {
    return <PremiumStatsFallback />;
  }
  return <PremiumStatsClient stats={stats} />;
}
