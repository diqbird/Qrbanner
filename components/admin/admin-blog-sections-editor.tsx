'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { AdminBlogEditorState } from '@/hooks/use-admin-blog-editor';
import { AdminBlogSectionRow } from './admin-blog-section-row';

type AdminBlogSectionsEditorProps = {
  editor: AdminBlogEditorState;
};

export function AdminBlogSectionsEditor({ editor }: AdminBlogSectionsEditorProps) {
  const { t, post, addSection } = editor;
  if (!post) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{t('admin.blog.sectionsTitle')}</p>
        <div className="flex flex-wrap gap-1">
          {(['h2', 'h3', 'p', 'ul', 'faq', 'img'] as const).map((type) => (
            <Button key={type} variant="outline" size="sm" className="h-7 text-xs" onClick={() => addSection(type)}>
              <Plus className="h-3 w-3 mr-1" />
              {type.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {post.sections.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('admin.blog.sectionsEmpty')}</p>
      ) : (
        <div className="space-y-3">
          {post.sections.map((section, index) => (
            <AdminBlogSectionRow key={index} editor={editor} section={section} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
