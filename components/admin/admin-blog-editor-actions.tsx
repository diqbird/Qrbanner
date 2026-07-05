'use client';

import { Button } from '@/components/ui/button';
import { ImageIcon, Save, Trash2 } from 'lucide-react';
import type { AdminBlogEditorState } from '@/hooks/use-admin-blog-editor';

type AdminBlogEditorActionsProps = {
  editor: AdminBlogEditorState;
};

export function AdminBlogEditorActions({ editor }: AdminBlogEditorActionsProps) {
  const { t, saving, deleting, save, deletePost, setMediaTarget, setMediaOpen } = editor;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Button onClick={save} loading={saving} className="gap-2">
        <Save className="h-4 w-4" /> {t('admin.blog.save')}
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => {
          setMediaTarget('new');
          setMediaOpen(true);
        }}
      >
        <ImageIcon className="h-4 w-4" /> {t('admin.blog.insertImage')}
      </Button>
      <Button variant="destructive" onClick={deletePost} loading={deleting} className="gap-2 ml-auto">
        <Trash2 className="h-4 w-4" /> {t('admin.blog.delete')}
      </Button>
    </div>
  );
}
