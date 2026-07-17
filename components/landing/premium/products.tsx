import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPinned,
  Megaphone,
  Store,
  IdCard,
} from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { Reveal } from './primitives';

const PRODUCTS = [
  {
    slug: 'trade-shows-expos',
    titleKey: 'premiumHome.products.rollupTitle',
    descKey: 'premiumHome.products.rollupDesc',
    Icon: Megaphone,
  },
  {
    slug: 'stadium-events',
    titleKey: 'premiumHome.products.eventTitle',
    descKey: 'premiumHome.products.eventDesc',
    Icon: CalendarDays,
  },
  {
    slug: 'retail-stores',
    titleKey: 'premiumHome.products.retailTitle',
    descKey: 'premiumHome.products.retailDesc',
    Icon: Store,
  },
  {
    slug: 'tourist-attractions',
    titleKey: 'premiumHome.products.outdoorTitle',
    descKey: 'premiumHome.products.outdoorDesc',
    Icon: MapPinned,
  },
  {
    slug: 'marketing-agencies',
    titleKey: 'premiumHome.products.promoTitle',
    descKey: 'premiumHome.products.promoDesc',
    Icon: Building2,
  },
  {
    slug: 'business-card',
    titleKey: 'premiumHome.products.customTitle',
    descKey: 'premiumHome.products.customDesc',
    Icon: IdCard,
  },
] as const;

export async function PremiumProducts() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="py-16 sm:py-20" aria-labelledby="premium-products-heading">
      <div className="ph-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="premium-products-heading" className="ph-title text-3xl sm:text-4xl">
            {t('premiumHome.products.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('premiumHome.products.subtitle')}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => {
            const Icon = product.Icon;
            return (
              <Reveal key={product.slug} delay={i * 0.05}>
                <Link
                  href={localizePath(`/solutions/${product.slug}`, locale)}
                  className="ph-card group flex h-full flex-col p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB]/15 to-[#06B6D4]/20 text-[#2563EB] dark:from-[#2563EB]/25 dark:to-[#06B6D4]/20 dark:text-sky-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {t(product.titleKey)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {t(product.descKey)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB]">
                    {t('premiumHome.products.learnMore')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
