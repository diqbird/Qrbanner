'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { BlogPostRecord } from '@/lib/blog-editor-utils';

export function useAdminBlogPostMutations({
  postId,
  post,
  onClose,
  onSaved,
  t,
}: {
  postId: string;
  post: BlogPostRecord | null;
  onClose: () => void;
  onSaved: () => void;
  t: (key: string) => string;
}) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const save = async () => {
    if (!post) return;
    if (!post.slug.trim() || !post.title.trim()) {
      toast.error(t('admin.blog.slugTitleRequired'));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: post.slug,
          title: post.title,
          description: post.description,
          category: post.category,
          author: post.author,
          readingMinutes: post.readingMinutes,
          keywords: post.keywords,
          sections: post.sections,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('admin.blog.updateFailed'));
        return;
      }
      toast.success(t('admin.blog.saved'));
      onSaved();
      onClose();
    } catch {
      toast.error(t('admin.blog.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!post || !window.confirm(t('admin.blog.deleteConfirm'))) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error(t('admin.blog.deleteFailed'));
        return;
      }
      toast.success(t('admin.blog.deleted'));
      onSaved();
      onClose();
    } catch {
      toast.error(t('admin.blog.deleteFailed'));
    } finally {
      setDeleting(false);
    }
  };

  return { saving, deleting, save, deletePost };
}
