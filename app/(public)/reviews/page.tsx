import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { CAPTERRA_REVIEW_URL, G2_REVIEW_URL } from '@/lib/marketing-config';
import { supportMailto } from '@/lib/site-contact';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('reviews.metaTitle'),
    description: t('reviews.metaDescription'),
    path: '/reviews',
  });
}

export default async function ReviewsPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const hasG2 = Boolean(G2_REVIEW_URL);
  const hasCapterra = Boolean(CAPTERRA_REVIEW_URL);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('reviews.pageTitle'),
          description: t('reviews.pageSubtitle'),
          path: '/reviews',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('reviews.pageTitle'), href: '/reviews' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="flex justify-center gap-1 text-amber-500" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-current" />
            ))}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('reviews.pageTitle')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t('reviews.pageSubtitle')}</p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {hasG2 && (
              <Link href={G2_REVIEW_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  {t('reviews.readOnG2')} <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {hasCapterra && (
              <Link href={CAPTERRA_REVIEW_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  {t('reviews.readOnCapterra')} <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <a href={supportMailto('QRbanner Review / Testimonial')}>
              <Button size="lg" className="gap-2">
                {t('reviews.shareExperience')}
              </Button>
            </a>
          </div>

          {!hasG2 && !hasCapterra && (
            <p className="mt-8 rounded-xl border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground">
              {t('reviews.noProfilesYet')}
            </p>
          )}

          <section className="mt-16 text-left">
            <h2 className="font-display text-xl font-semibold text-center">{t('reviews.highlightsTitle')}</h2>
            <ul className="mt-6 space-y-4">
              {(['reviews.highlight1', 'reviews.highlight2', 'reviews.highlight3'] as const).map((key) => (
                <li
                  key={key}
                  className="rounded-xl border border-border/50 bg-card p-5 text-sm text-muted-foreground leading-relaxed"
                >
                  {t(key)}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 text-left">
            <h2 className="font-display text-xl font-semibold text-center">{t('reviews.stepsTitle')}</h2>
            <ol className="mt-6 space-y-4">
              {(['reviews.step1', 'reviews.step2', 'reviews.step3'] as const).map((key, i) => (
                <li
                  key={key}
                  className="flex gap-4 rounded-xl border border-border/50 bg-muted/20 p-5 text-sm text-muted-foreground leading-relaxed"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  {t(key)}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-center">
              <Link href="/reviews/prompts" className="text-sm font-medium text-primary hover:underline">
                {t('reviewPrompts.title')} →
              </Link>
              <span className="mx-2 text-muted-foreground">·</span>
              <Link href="/reviews/g2-setup" className="text-sm font-medium text-primary hover:underline">
                {t('g2Setup.title')} →
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
