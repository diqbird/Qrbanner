import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { formatFreePlanDynamicQrShortLabel } from '@/lib/i18n/dynamic-qr-label';
import { formatQrTypeCount } from '@/lib/i18n/qr-type-count';
import { LandingHeroContent } from '@/components/landing/landing-hero-content';
import { LandingHeroHighlights } from '@/components/landing/landing-hero-highlights';

export async function LandingHeroStatic() {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const qrLabel = formatFreePlanDynamicQrShortLabel(locale);
  const qrTypeCount = formatQrTypeCount(locale);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-foreground/[0.06] blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 [perspective:1600px]">
        <LandingHeroContent t={t} locale={locale} qrLabel={qrLabel} qrTypeCount={qrTypeCount} />
        <LandingHeroHighlights t={t} qrTypeCount={qrTypeCount} />
      </div>
    </section>
  );
}
