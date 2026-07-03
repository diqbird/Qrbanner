import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { BlogArticleBody } from '@/components/public/blog-article-body';
import { ProgrammaticInternalLinks } from '@/components/seo/programmatic-internal-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

type Props = { params: { slug: string } };

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Not found' };
  const locale = await getServerLocale();
  return pageMetadata({
    locale,
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const locale = await getServerLocale();
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);
  const dateLocale = locale === 'tr' ? 'tr-TR' : 'en-US';

  const faqSection = post.sections.find((s) => s.type === 'faq');
  const faqItems = faqSection?.faq ?? [];

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { '@type': 'Organization', name: post.author },
            publisher: {
              '@type': 'Organization',
              name: 'QRbanner',
              logo: { '@type': 'ImageObject', url: absoluteUrl('/opengraph-image') },
            },
            mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          },
          ...(faqItems.length
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqItems.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: { '@type': 'Answer', text: item.answer },
                  })),
                },
              ]
            : []),
        ]}
      />
      <PublicBreadcrumbs
        items={[
          { label: t('nav.blog'), href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6 gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" aria-hidden /> {t('blogPost.allArticles')}
            </Button>
          </Link>

          <header>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{post.category}</Badge>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {t('blogPost.minRead', { minutes: post.readingMinutes })}
              </span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.description}</p>
          </header>

          <div className="mt-10">
            <BlogArticleBody sections={post.sections} />
          </div>

          <ProgrammaticInternalLinks variant="blog" />

          <div className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="font-display text-xl font-bold">{t('blogPost.ctaTitle')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('blogPost.ctaBody')}</p>
            <Link href="/qr/create" className="mt-4 inline-block">
              <Button size="lg">{t('blogPost.ctaButton')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
