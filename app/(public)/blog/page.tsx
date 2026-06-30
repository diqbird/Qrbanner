import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('blogIndex.metaTitle'),
    description: t('blogIndex.metaDescription'),
    path: '/blog',
    keywords: ['QR code blog', 'dynamic QR guide', 'QR marketing tips', 'QR code tutorial'],
  });
}

export default async function BlogIndexPage() {
  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const posts = await getAllPosts();
  const dateLocale = locale === 'tr' ? 'tr-TR' : 'en-US';

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: t('blogIndex.jsonLdName'),
          url: 'https://qrbanner.com/blog',
          publisher: { '@type': 'Organization', name: 'QRbanner' },
        }}
      />
      <PublicBreadcrumbs items={[{ label: t('nav.blog'), href: '/blog' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <header className="text-center">
            <Badge variant="secondary" className="mb-4">
              {t('blogIndex.badge')}
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {t('blogIndex.title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('blogIndex.subtitle')}</p>
          </header>

          <div className="mt-14 space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-border/50 bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {t('blogIndex.minRead', { minutes: post.readingMinutes })}
                  </span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="mt-3 font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{post.description}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {t('blogIndex.readArticle')} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
