import type { BlogPost } from './types';
import { getPublishedPosts, getPostBySlug, getAllPostSlugs } from './posts-service';

import type { Locale } from '@/lib/i18n/types';

export async function getAllPosts(locale: Locale = 'en'): Promise<BlogPost[]> {
  return getPublishedPosts(locale);
}

export { getPostBySlug, getAllPostSlugs };
export type { BlogPost, BlogSection } from './types';
