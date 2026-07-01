export interface BlogSection {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'faq' | 'img';
  content?: string;
  items?: string[];
  faq?: { question: string; answer: string }[];
  src?: string;
  alt?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  author: string;
  category: string;
  sections: BlogSection[];
}
