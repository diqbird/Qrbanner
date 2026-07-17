import { MetadataRoute } from 'next';
import { SOLUTION_PAGES } from '@/lib/solutions';
import { USE_CASE_PAGES } from '@/lib/use-case-pages';
import { buildQrTypePages } from '@/lib/qr-type-pages';
import { COMPETITOR_PAGES } from '@/lib/competitor-pages';
import { STATIC_POSTS } from '@/lib/blog/posts-service';
import { hasLocalizedBlogPost } from '@/lib/blog/localize-post';
import { CASE_STUDIES } from '@/lib/case-studies';
import { INDUSTRY_TEMPLATES } from '@/lib/industry-templates';
import { localizePath, shouldLocalizePath } from '@/lib/i18n/locale-path';
import type { Locale } from '@/lib/i18n/types';
import type { BlogPost } from '@/lib/blog/types';
import { listGeoComboParams } from '@/lib/geo-seo-pages';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  'https://qrbanner.com'
).replace(/\/$/, '');

const PUBLIC_PATHS = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/qr/create', priority: 0.95, changeFrequency: 'weekly' as const },
  { path: '/features', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/solutions', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/templates', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/qr-types', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/use-cases', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/geo', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/vs', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/apps', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/marketplace', priority: 0.75, changeFrequency: 'weekly' as const },
  { path: '/integrations', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/integrations/zapier', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/integrations/make', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/integrations/hubspot', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/integrations/salesforce', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/customers', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/roi-calculator', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/security', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/trust', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/trust/soc2-readiness', priority: 0.72, changeFrequency: 'monthly' as const },
  { path: '/trust/hipaa-readiness', priority: 0.72, changeFrequency: 'monthly' as const },
  { path: '/trust/procurement-request', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/dpa', priority: 0.55, changeFrequency: 'yearly' as const },
  { path: '/sub-processors', priority: 0.55, changeFrequency: 'yearly' as const },
  { path: '/enterprise', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/case-studies', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/reviews', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/reviews/g2-setup', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: '/referral', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/affiliates', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/brand/logos', priority: 0.45, changeFrequency: 'yearly' as const },
  { path: '/downloads/enterprise-overview', priority: 0.6, changeFrequency: 'yearly' as const },
  { path: '/demo', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/blog', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/help', priority: 0.8, changeFrequency: 'monthly' as const },
  // /status is noindex (ops transparency) — omit from sitemap
  { path: '/developers', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/developers/reference', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/refund', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
];

const LOCALIZED_SITEMAP_LOCALES: Locale[] = ['tr', 'de', 'es'];

function buildLocalizedSitemapEntries(
  locale: Locale,
  now: Date,
  marketplaceIds: string[] = [],
  posts: BlogPost[] = STATIC_POSTS
): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${localizePath(path, locale)}`;
  const adjustPriority = (priority: number) => Math.max(0.3, priority - 0.05);

  const publicEntries = PUBLIC_PATHS.filter(({ path }) => shouldLocalizePath(path || '/')).map(
    ({ path, priority, changeFrequency }) => ({
      url: url(path || '/'),
      lastModified: now,
      changeFrequency,
      priority: adjustPriority(priority),
    }),
  );

  const solutionEntries = SOLUTION_PAGES.map((s) => ({
    url: url(`/solutions/${s.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'tr' ? 0.8 : 0.75,
  }));

  const qrTypeEntries = buildQrTypePages().map((p) => ({
    url: url(`/qr-types/${p.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'tr' ? 0.75 : 0.72,
  }));

  const useCaseEntries = USE_CASE_PAGES.map((p) => ({
    url: url(`/use-cases/${p.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'tr' ? 0.77 : 0.74,
  }));

  const vsEntries = COMPETITOR_PAGES.map((p) => ({
    url: url(`/vs/${p.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'tr' ? 0.7 : 0.68,
  }));

  const templateDetailEntries = INDUSTRY_TEMPLATES.map((tpl) => ({
    url: url(`/templates/${tpl.id}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'tr' ? 0.75 : 0.72,
  }));

  const caseStudyEntries = CASE_STUDIES.map((study) => ({
    url: url(`/case-studies/${study.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'tr' ? 0.72 : 0.7,
  }));

  const marketplaceEntries = marketplaceIds.map((id) => ({
    url: url(`/marketplace/${id}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: locale === 'tr' ? 0.62 : 0.6,
  }));

  const geoEntries = listGeoComboParams().map(({ city, sector }) => ({
    url: url(`/geo/${city}/${sector}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'tr' ? 0.68 : 0.65,
  }));

  const geoCityEntries = Array.from(new Set(listGeoComboParams().map((p) => p.city))).map((city) => ({
    url: url(`/geo/${city}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'tr' ? 0.74 : 0.71,
  }));

  const blogPostEntries = posts
    .filter((post) => hasLocalizedBlogPost(post.slug, locale))
    .map((post) => ({
      url: url(`/blog/${post.slug}`),
      lastModified: safeDate(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: locale === 'tr' ? 0.78 : 0.75,
    }));

  return [
    ...publicEntries,
    ...solutionEntries,
    ...qrTypeEntries,
    ...useCaseEntries,
    ...vsEntries,
    ...templateDetailEntries,
    ...caseStudyEntries,
    ...marketplaceEntries,
    ...geoEntries,
    ...geoCityEntries,
    ...blogPostEntries,
  ];
}

function safeDate(value: string | Date | undefined): Date {
  if (!value) return new Date();
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

async function loadPosts(): Promise<BlogPost[]> {
  try {
    const { getAllPosts } = await import('@/lib/blog');
    return await getAllPosts();
  } catch (err) {
    console.error('[sitemap] getAllPosts failed, using static posts:', err);
    return STATIC_POSTS;
  }
}

async function loadPublishedMarketplaceIds(): Promise<string[]> {
  try {
    const { prisma } = await import('@/lib/db');
    const rows = await prisma.marketplaceListing.findMany({
      where: { status: 'published' },
      select: { id: true },
      orderBy: { updatedAt: 'desc' },
      take: 500,
    });
    return rows.map((r) => r.id);
  } catch (err) {
    console.error('[sitemap] marketplace listings failed:', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let posts: BlogPost[] = STATIC_POSTS;
  try {
    posts = await loadPosts();
  } catch {
    /* keep static fallback */
  }

  const solutionEntries = SOLUTION_PAGES.map((s) => ({
    url: `${SITE_URL}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const qrTypeEntries = buildQrTypePages().map((p) => ({
    url: `${SITE_URL}/qr-types/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const useCaseEntries = USE_CASE_PAGES.map((p) => ({
    url: `${SITE_URL}/use-cases/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.82,
  }));

  const vsEntries = COMPETITOR_PAGES.map((p) => ({
    url: `${SITE_URL}/vs/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const blogEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: safeDate(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const caseStudyEntries = CASE_STUDIES.map((study) => ({
    url: `${SITE_URL}/case-studies/${study.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const templateDetailEntries = INDUSTRY_TEMPLATES.map((tpl) => ({
    url: `${SITE_URL}/templates/${tpl.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const marketplaceIds = await loadPublishedMarketplaceIds();
  const marketplaceEntries = marketplaceIds.map((id) => ({
    url: `${SITE_URL}/marketplace/${id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.65,
  }));

  const localizedEntries = LOCALIZED_SITEMAP_LOCALES.flatMap((locale) =>
    buildLocalizedSitemapEntries(locale, now, marketplaceIds, posts),
  );

  return [
    ...PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...solutionEntries,
    ...qrTypeEntries,
    ...useCaseEntries,
    ...vsEntries,
    ...blogEntries,
    ...caseStudyEntries,
    ...templateDetailEntries,
    ...marketplaceEntries,
    ...localizedEntries,
    ...listGeoComboParams().map(({ city, sector }) => ({
      url: `${SITE_URL}/geo/${city}/${sector}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.72,
    })),
    ...Array.from(new Set(listGeoComboParams().map((p) => p.city))).map((city) => ({
      url: `${SITE_URL}/geo/${city}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.78,
    })),
  ];
}
