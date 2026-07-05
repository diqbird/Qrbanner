'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { AdminBlogPost } from '@/lib/admin-blog-panel-types';

export function useAdminBlogMutations({
  t,
  fetchPosts,
}: {
  t: (key: string) => string;
  fetchPosts: () => Promise<void>;
}) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createPost = async () => {
    if (!slug.trim() || !title.trim()) {
      toast.error(t('admin.blog.slugTitleRequired'));
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          description: description || title,
          published: false,
          sections: [{ type: 'p', content: t('admin.blog.defaultSection') }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('admin.blog.createFailed'));
        return;
      }
      toast.success(t('admin.blog.draftCreated'));
      setSlug('');
      setTitle('');
      setDescription('');
      await fetchPosts();
      if (data.post?.id) setEditingId(data.post.id);
    } catch {
      toast.error(t('admin.blog.createFailed'));
    } finally {
      setCreating(false);
    }
  };

  const togglePublish = async (post: AdminBlogPost) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) {
        toast.success(post.published ? t('admin.blog.unpublished') : t('admin.blog.published'));
        fetchPosts();
      }
    } catch {
      toast.error(t('admin.blog.updateFailed'));
    }
  };

  return {
    creating,
    editingId,
    setEditingId,
    slug,
    setSlug,
    title,
    setTitle,
    description,
    setDescription,
    createPost,
    togglePublish,
  };
}
