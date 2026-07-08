import type { Locale } from '@/lib/i18n/types';
import type { BlogPost } from './types';
import { whatsappOrderingQrTr } from './posts/tr/whatsapp-ordering-qr';
import { googleReviewQrTr } from './posts/tr/google-review-qr';

/** Turkish content overrides keyed by slug (same URL, locale from cookie/header). */
const TR_POSTS: Record<string, BlogPost> = {
  [whatsappOrderingQrTr.slug]: whatsappOrderingQrTr,
  [googleReviewQrTr.slug]: googleReviewQrTr,
};

export function localizeBlogPost(post: BlogPost, locale: Locale): BlogPost {
  if (locale !== 'tr') return post;
  const tr = TR_POSTS[post.slug];
  if (!tr) return post;
  return {
    ...post,
    title: tr.title,
    description: tr.description,
    keywords: tr.keywords,
    category: tr.category,
    sections: tr.sections,
    readingMinutes: tr.readingMinutes,
  };
}

export function hasTurkishBlogPost(slug: string): boolean {
  return slug in TR_POSTS;
}
