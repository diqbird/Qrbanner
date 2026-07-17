import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { CUSTOMER_LOGOS } from '@/lib/customer-logos';
import { Reveal } from './primitives';

const INDUSTRY_KEYS = [
  'premiumHome.trust.retail',
  'premiumHome.trust.airports',
  'premiumHome.trust.hotels',
  'premiumHome.trust.malls',
  'premiumHome.trust.exhibitions',
  'premiumHome.trust.events',
] as const;

export async function PremiumTrust() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="pb-14 sm:pb-16" aria-label={t('premiumHome.trust.eyebrow')}>
      <div className="ph-container">
        <Reveal>
          <p className="text-center text-sm font-medium text-muted-foreground">{t('premiumHome.trust.eyebrow')}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {INDUSTRY_KEYS.map((key) => (
              <span
                key={key}
                className="rounded-full border border-border/80 bg-card px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm"
              >
                {t(key)}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {CUSTOMER_LOGOS.slice(0, 6).map((logo) => (
              <div
                key={logo.id}
                className="flex h-11 min-w-[7rem] items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/50 px-4"
              >
                <span className="font-display text-sm font-semibold tracking-tight text-muted-foreground">
                  {logo.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
