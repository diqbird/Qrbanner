import type { BlogPost } from './types';
import { getPublishedPosts, getPostBySlug, getAllPostSlugs } from './posts-service';

export async function getAllPosts(): Promise<BlogPost[]> {
  return getPublishedPosts();
}

export { getPostBySlug, getAllPostSlugs };
export type { BlogPost, BlogSection } from './types';
