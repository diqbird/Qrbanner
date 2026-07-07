import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { freePlanQrLimit } from '@/lib/plans';
import { LandingHeroContent } from '@/components/landing/landing-hero-content';
import { LandingHeroHighlights } from '@/components/landing/landing-hero-highlights';

export async function LandingHeroStatic() {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const freeQrCount = formatLocaleNumber(freePlanQrLimit(), locale);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24 lg:py-28">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-xl lg:blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-xl lg:blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <LandingHeroContent t={t} freeQrCount={freeQrCount} />
        <LandingHeroHighlights t={t} />
      </div>
    </section>
  );
}
