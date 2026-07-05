'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SeoPreviewCard } from '@/components/seo/seo-preview-card';
import type { AdminBlogEditorState } from '@/hooks/use-admin-blog-editor';

type AdminBlogMetaFieldsProps = {
  editor: AdminBlogEditorState;
};

export function AdminBlogMetaFields({ editor }: AdminBlogMetaFieldsProps) {
  const { t, post, setPost } = editor;
  if (!post) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1">
        <Label>{t('admin.blog.titleLabel')}</Label>
        <Input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label>{t('admin.blog.slug')}</Label>
        <Input value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label>{t('admin.blog.description')}</Label>
        <Textarea
          value={post.description}
          onChange={(e) => setPost({ ...post, description: e.target.value })}
          rows={2}
        />
      </div>
      <div className="space-y-1">
        <Label>{t('admin.blog.category')}</Label>
        <Input value={post.category} onChange={(e) => setPost({ ...post, category: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label>{t('admin.blog.readingMinutes')}</Label>
        <Input
          type="number"
          min={1}
          max={60}
          value={post.readingMinutes}
          onChange={(e) => setPost({ ...post, readingMinutes: Number(e.target.value) || 8 })}
        />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label>{t('admin.blog.keywords')}</Label>
        <Input
          value={post.keywords.join(', ')}
          onChange={(e) =>
            setPost({
              ...post,
              keywords: e.target.value
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean),
            })
          }
          placeholder={t('admin.blog.keywordsPlaceholder')}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label>{t('admin.blog.seoPreview')}</Label>
        <SeoPreviewCard
          title={post.title}
          description={post.description}
          url={`/blog/${post.slug || 'slug'}`}
        />
      </div>
    </div>
  );
}
