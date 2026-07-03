import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { G2_REVIEW_URL, CAPTERRA_REVIEW_URL } from '@/lib/marketing-config';

const PROMPT_KEYS = ['reviewPrompts.restaurant', 'reviewPrompts.agency', 'reviewPrompts.retail'] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('reviewPrompts.metaTitle'),
    description: t('reviewPrompts.metaDescription'),
    path: '/reviews/prompts',
  });
}

export default async function ReviewPromptsPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const hasG2 = Boolean(G2_REVIEW_URL);
  const hasCapterra = Boolean(CAPTERRA_REVIEW_URL);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('reviewPrompts.title'),
          description: t('reviewPrompts.subtitle'),
          path: '/reviews/prompts',
        })}
      />
      <PublicBreadcrumbs
        items={[
          { label: t('reviews.pageTitle'), href: '/reviews' },
          { label: t('reviewPrompts.title'), href: '/reviews/prompts' },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('reviewPrompts.title')}</h1>
            <p className="mt-4 text-muted-foreground">{t('reviewPrompts.subtitle')}</p>
          </header>

          <div className="mt-8 flex flex-wrap gap-3">
            {hasG2 && (
              <Link href={G2_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                {t('reviews.readOnG2')} →
              </Link>
            )}
            {hasCapterra && (
              <Link
                href={CAPTERRA_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t('reviews.readOnCapterra')} →
              </Link>
            )}
            <Link href="/reviews" className="text-sm text-muted-foreground hover:text-primary">
              {t('reviewPrompts.backToReviews')} →
            </Link>
          </div>

          <div className="mt-10 space-y-6">
            {PROMPT_KEYS.map((key) => (
              <article key={key} className="rounded-xl border border-border/50 bg-card p-5">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground font-sans">{t(key)}</pre>
              </article>
            ))}
          </div>

          <p className="mt-10 text-sm text-muted-foreground">{t('reviewPrompts.footer')}</p>
        </div>
      </div>
    </>
  );
}
