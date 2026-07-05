export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
  readingMinutes: number;
}
