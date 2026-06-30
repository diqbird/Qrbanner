import Link from 'next/link';
import { Star } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { CAPTERRA_REVIEW_URL, G2_REVIEW_URL } from '@/lib/marketing-config';
import { supportMailto } from '@/lib/site-contact';

export async function LandingReviewsStrip() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const hasG2 = Boolean(G2_REVIEW_URL);
  const hasCapterra = Boolean(CAPTERRA_REVIEW_URL);

  if (!hasG2 && !hasCapterra) {
    return (
      <section className="border-y border-border/40 bg-muted/10 py-8">
        <div className="mx-auto max-w-[1080px] px-4 text-center sm:px-6">
          <div className="flex justify-center gap-0.5 text-amber-500" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t('reviews.earlyAdopter')}</p>
          <a
            href={supportMailto('QRbanner Review / Testimonial')}
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t('reviews.shareExperience')}
          </a>
          <Link href="/reviews" className="mt-1 block text-xs text-muted-foreground hover:text-primary">
            {t('nav.reviews')} →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-border/40 bg-muted/10 py-8">
      <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-4 px-4 sm:flex-row sm:justify-center sm:gap-8 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 text-amber-500" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="text-sm font-medium">{t('reviews.lovedByTeams')}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {hasG2 && (
            <Link
              href={G2_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('reviews.readOnG2')} →
            </Link>
          )}
          {hasCapterra && (
            <Link
              href={CAPTERRA_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('reviews.readOnCapterra')} →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
