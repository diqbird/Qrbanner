import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { G2_REVIEW_URL } from '@/lib/marketing-config';
import { CheckCircle2 } from 'lucide-react';

const STEP_KEYS = ['g2Setup.step1', 'g2Setup.step2', 'g2Setup.step3', 'g2Setup.step4', 'g2Setup.step5'] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('g2Setup.metaTitle'),
    description: t('g2Setup.metaDescription'),
    path: '/reviews/g2-setup',
  });
}

export default async function G2SetupPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const hasG2 = Boolean(G2_REVIEW_URL);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('g2Setup.title'),
          description: t('g2Setup.subtitle'),
          path: '/reviews/g2-setup',
          locale,
        })}
      />
      <PremiumPageFrame narrow="3xl">
        <PublicBreadcrumbs
        items={[
        { label: t('reviews.pageTitle'), href: '/reviews' },
        { label: t('g2Setup.title'), href: '/reviews/g2-setup' },
        ]}
        />
          <header>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('g2Setup.title')}</h1>
            <p className="mt-4 text-muted-foreground">{t('g2Setup.subtitle')}</p>
          </header>

          <ol className="mt-10 space-y-4">
            {STEP_KEYS.map((key, i) => (
              <li
                key={key}
                className="flex gap-4 rounded-xl border border-border/50 bg-card p-5 text-sm text-muted-foreground leading-relaxed"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                  {i + 1}
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="font-display font-semibold">{t('g2Setup.afterTitle')}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {(['g2Setup.after1', 'g2Setup.after2', 'g2Setup.after3'] as const).map((key) => (
                <li key={key} className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            {hasG2 ? (
              <Link href={G2_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                {t('reviews.readOnG2')} →
              </Link>
            ) : null}
            <Link href="/reviews" className="text-muted-foreground hover:text-primary">
              {t('g2Setup.backToReviews')} →
            </Link>
          </div>
      </PremiumPageFrame>
    </>
  );
}
