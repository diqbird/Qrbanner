import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
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
    <section className="pb-12 sm:pb-14" aria-label={t('premiumHome.trust.eyebrow')}>
      <div className="ph-container">
        <Reveal>
          <div className="mx-auto max-w-3xl border-y border-[var(--ph-rule)] py-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ph-ink)]/55">
              {t('premiumHome.trust.eyebrow')}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {INDUSTRY_KEYS.map((key) => (
                <span
                  key={key}
                  className="rounded-sm border border-[var(--ph-rule)] bg-[var(--ph-tint)] px-3 py-1.5 text-xs font-medium text-[var(--ph-ink)]/85"
                >
                  {t(key)}
                </span>
              ))}
            </div>
          </div>

          {hasReviews ? (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {hasG2 ? (
                <Link
                  href={G2_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-[var(--ph-rule)] bg-[var(--ph-tint)] px-4 py-2 text-xs font-semibold text-[var(--ph-ink)]/85 transition hover:border-[var(--ph-ultramarine)] hover:text-[var(--ph-ultramarine)]"
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
                  className="inline-flex items-center gap-2 rounded-sm border border-[var(--ph-rule)] bg-[var(--ph-tint)] px-4 py-2 text-xs font-semibold text-[var(--ph-ink)]/85 transition hover:border-[var(--ph-ultramarine)] hover:text-[var(--ph-ultramarine)]"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                  {t('reviews.readOnCapterra')}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
                </Link>
              ) : null}
              <Link
                href={localizePath('/reviews', locale)}
                className="text-xs font-medium text-[var(--ph-ink)]/55 underline-offset-4 hover:text-[var(--ph-ink)] hover:underline"
              >
                {t('reviews.pageTitle')}
              </Link>
            </div>
          ) : (
            <div className="mt-7 text-center">
              <Link
                href={localizePath('/reviews/g2-setup', locale)}
                className="text-xs font-medium text-[var(--ph-ink)]/55 underline-offset-4 hover:text-[var(--ph-ink)] hover:underline"
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
