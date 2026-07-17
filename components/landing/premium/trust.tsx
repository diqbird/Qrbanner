import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { CUSTOMER_LOGOS } from '@/lib/customer-logos';
import { CAPTERRA_REVIEW_URL, G2_REVIEW_URL } from '@/lib/marketing-config';
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
  const hasG2 = Boolean(G2_REVIEW_URL);
  const hasCapterra = Boolean(CAPTERRA_REVIEW_URL);
  const hasReviews = hasG2 || hasCapterra;

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
                className="flex h-12 min-w-[7.5rem] items-center justify-center rounded-xl border border-border/70 bg-card/60 px-4"
              >
                {logo.imageSrc ? (
                  <Image
                    src={logo.imageSrc}
                    alt={logo.label}
                    width={100}
                    height={28}
                    className="h-7 w-auto max-w-[6.5rem] object-contain opacity-85 grayscale"
                  />
                ) : (
                  <span className="font-display text-sm font-semibold tracking-tight text-muted-foreground">
                    {logo.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {hasReviews ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {hasG2 ? (
                <Link
                  href={G2_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-semibold text-foreground/85 transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                  {t('reviews.readOnG2')}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </Link>
              ) : null}
              {hasCapterra ? (
                <Link
                  href={CAPTERRA_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-xs font-semibold text-foreground/85 transition hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                  {t('reviews.readOnCapterra')}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </Link>
              ) : null}
              <Link
                href={localizePath('/reviews', locale)}
                className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {t('reviews.pageTitle')}
              </Link>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <Link
                href={localizePath('/reviews', locale)}
                className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {t('reviews.pageTitle')}
              </Link>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
