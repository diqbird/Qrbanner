import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { absoluteLocalizedUrl, pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumPageFrame } from '@/components/landing/premium/page-frame';
import { Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import { formatLocaleNumber, resolveBcp47Locale } from '@/lib/i18n/format-locale';

export const dynamic = 'force-dynamic';

const POSTS_PER_PAGE = 12;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('blogIndex.metaTitle'),
    description: t('blogIndex.metaDescription'),
    path: '/blog',
    keywords:
      locale === 'tr'
        ? ['QR kod blog', 'dinamik QR rehberi', 'QR pazarlama ipuçları', 'QR kod eğitimi']
        : locale === 'de'
          ? ['QR-Code Blog', 'dynamischer QR-Leitfaden', 'QR-Marketing-Tipps', 'QR-Code Tutorial']
          : locale === 'es'
            ? ['blog códigos QR', 'guía QR dinámico', 'consejos marketing QR', 'tutorial código QR']
            : ['QR code blog', 'dynamic QR guide', 'QR marketing tips', 'QR code tutorial'],
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const allPosts = await getAllPosts(locale);
  const dateLocale = resolveBcp47Locale(locale);

  const { page: pageParam } = await searchParams;
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  );
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);
  const pageHref = (p: number) => {
    const path = p <= 1 ? '/blog' : `/blog?page=${p}`;
    return localizePath(path, locale);
  };

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: t('blogIndex.jsonLdName'),
          url: absoluteLocalizedUrl('/blog', locale),
          inLanguage: resolveBcp47Locale(locale),
          publisher: { '@type': 'Organization', name: 'QRbanner' },
        }}
      />
      <PremiumPageFrame narrow="800">
        <PublicBreadcrumbs items={[{ label: t('nav.blog'), href: '/blog' }]} />
        <header className="relative text-center">
          <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
            <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
          </div>
          <p className="ph-eyebrow mb-4">{t('blogIndex.badge')}</p>
          <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('blogIndex.title')}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('blogIndex.subtitle')}</p>
        </header>

        <div className="mt-14 space-y-4">
          {posts.map((post) => (
            <article key={post.slug} className="ph-card group p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border/60 bg-background/80 px-2 py-0.5 font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {t('blogIndex.minRead', {
                    minutes: formatLocaleNumber(post.readingMinutes, locale),
                  })}
                </span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <h2 className="ph-title mt-3 text-xl transition-colors group-hover:text-[#2563EB] dark:group-hover:text-sky-400">
                <Link href={localizePath(`/blog/${post.slug}`, locale)}>{post.title}</Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
              <Link
                href={localizePath(`/blog/${post.slug}`, locale)}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline dark:text-sky-400"
              >
                {t('blogIndex.readArticle')} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            className="mt-12 flex items-center justify-between gap-4"
            aria-label={t('blogIndex.paginationAria')}
          >
            {currentPage > 1 ? (
              <Link
                href={pageHref(currentPage - 1)}
                rel="prev"
                className="ph-btn-secondary px-4 py-2"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden /> {t('blogIndex.prev')}
              </Link>
            ) : (
              <span aria-hidden />
            )}

            <span className="text-sm text-muted-foreground">
              {t('blogIndex.pageInfo', {
                page: formatLocaleNumber(currentPage, locale),
                total: formatLocaleNumber(totalPages, locale),
              })}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={pageHref(currentPage + 1)}
                rel="next"
                className="ph-btn-secondary px-4 py-2"
              >
                {t('blogIndex.next')} <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <span aria-hidden />
            )}
          </nav>
        )}
      </PremiumPageFrame>
    </>
  );
}
