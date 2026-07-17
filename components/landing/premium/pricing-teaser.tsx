import Link from 'next/link';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { Reveal } from './primitives';

export async function PremiumPricingTeaser() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="py-12 sm:py-14" aria-labelledby="premium-pricing-teaser">
      <div className="ph-container">
        <Reveal>
          <div className="ph-card flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center hover:translate-y-0 hover:scale-100">
            <div>
              <h2 id="premium-pricing-teaser" className="ph-title text-2xl sm:text-3xl">
                {t('premiumHome.pricingTeaser.title')}
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">{t('premiumHome.pricingTeaser.subtitle')}</p>
            </div>
            <Link href={localizePath('/pricing', locale)} className="ph-btn-primary shrink-0">
              {t('premiumHome.pricingTeaser.cta')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
