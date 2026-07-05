'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { useAdminBlogEditor } from '@/hooks/use-admin-blog-editor';
import { AdminBlogMetaFields } from './admin-blog-meta-fields';
import { AdminBlogSectionsEditor } from './admin-blog-sections-editor';
import { AdminBlogEditorActions } from './admin-blog-editor-actions';

interface AdminBlogEditorProps {
  postId: string;
  onClose: () => void;
  onSaved: () => void;
}

export function AdminBlogEditor({ postId, onClose, onSaved }: AdminBlogEditorProps) {
  const editor = useAdminBlogEditor({ postId, onClose, onSaved });
  const { t, loading, post, mediaOpen, setMediaOpen, insertImage } = editor;

  if (loading || !post) {
    return (
      <div className="rounded-xl border border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-4 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display font-semibold">{t('admin.blog.editTitle')}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <AdminBlogMetaFields editor={editor} />
      <AdminBlogSectionsEditor editor={editor} />
      <AdminBlogEditorActions editor={editor} />
      <MediaPickerDialog open={mediaOpen} onOpenChange={setMediaOpen} onSelect={insertImage} />
    </div>
  );
}
