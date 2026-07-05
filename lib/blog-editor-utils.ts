import type { BlogSection } from '@/lib/blog/types';

export interface BlogPostRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  keywords: string[];
  readingMinutes: number;
  published: boolean;
  sections: BlogSection[];
}

export function emptyBlogSection(type: BlogSection['type']): BlogSection {
  if (type === 'ul') return { type, items: [''] };
  if (type === 'faq') return { type, faq: [{ question: '', answer: '' }] };
  if (type === 'img') return { type, src: '', alt: '' };
  return { type, content: '' };
}
