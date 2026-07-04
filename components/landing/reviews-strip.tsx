import Link from 'next/link';
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
          <p className="text-sm text-muted-foreground">{t('reviews.earlyAdopter')}</p>
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
        <span className="text-sm font-medium">{t('reviews.lovedByTeams')}</span>
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
