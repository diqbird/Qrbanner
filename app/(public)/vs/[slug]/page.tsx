import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { COMPETITOR_PAGES, getCompetitorBySlug } from '@/lib/competitor-pages';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export function generateStaticParams() {
  return COMPETITOR_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = getCompetitorBySlug(params.slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/vs/${page.slug}`,
  });
}

export default async function VsDetailPage({ params }: { params: { slug: string } }) {
  const page = getCompetitorBySlug(params.slug);
  if (!page) notFound();

  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);

  return (
    <>
      <PublicBreadcrumbs
        items={[
          { label: t('nav.comparisons'), href: '/vs' },
          { label: page.name, href: `/vs/${page.slug}` },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <header className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{page.headline}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{page.summary}</p>
          </header>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <section className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <h2 className="font-display font-semibold text-primary">{t('vsDetail.qrbannerAdvantages')}</h2>
              <ul className="mt-4 space-y-2">
                {page.qrbannerWins.map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border border-border/50 bg-card p-5">
              <h2 className="font-display font-semibold">
                {t('vsDetail.competitorConsiderations', { name: page.name })}
              </h2>
              <ul className="mt-4 space-y-2">
                {page.competitorWeaknesses.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">• {item}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left">
                  <th className="p-4 font-medium">{t('vsDetail.colFeature')}</th>
                  <th className="p-4 font-medium">{t('vsDetail.colQrbanner')}</th>
                  <th className="p-4 font-medium">{page.name}</th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b last:border-0">
                    <td className="p-4">{row.feature}</td>
                    <td className="p-4 font-medium text-primary">{row.qrbanner}</td>
                    <td className="p-4 text-muted-foreground">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                {t('vsDetail.ctaTryFree')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              <Link href="/pricing" className="text-primary hover:underline">
                {t('vsDetail.viewPricing')}
              </Link>
              {' · '}
              <Link href="/vs" className="text-primary hover:underline">
                {t('vsDetail.allComparisons')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
