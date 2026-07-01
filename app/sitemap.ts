import { MetadataRoute } from 'next';
import { SOLUTION_PAGES } from '@/lib/solutions';
import { buildQrTypePages } from '@/lib/qr-type-pages';
import { COMPETITOR_PAGES } from '@/lib/competitor-pages';
import { STATIC_POSTS } from '@/lib/blog/posts-service';
import { CASE_STUDIES } from '@/lib/case-studies';
import type { BlogPost } from '@/lib/blog/types';

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
  { path: '/vs', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/integrations', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/integrations/zapier', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/customers', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/roi-calculator', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/security', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/enterprise', priority: 0.85, changeFrequency: 'monthly' as const },
  { path: '/case-studies', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/reviews', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/reviews/prompts', priority: 0.55, changeFrequency: 'monthly' as const },
  { path: '/reviews/g2-setup', priority: 0.5, changeFrequency: 'yearly' as const },
  { path: '/referral', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/affiliates', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/brand/logos', priority: 0.45, changeFrequency: 'yearly' as const },
  { path: '/downloads/enterprise-overview', priority: 0.6, changeFrequency: 'yearly' as const },
  { path: '/demo', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/blog', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/developers', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
];

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

  return [
    ...PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...solutionEntries,
    ...qrTypeEntries,
    ...vsEntries,
    ...blogEntries,
    ...caseStudyEntries,
  ];
}
