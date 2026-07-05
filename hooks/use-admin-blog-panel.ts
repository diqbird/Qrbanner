'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AdminBlogPost } from '@/lib/admin-blog-panel-types';

export function useAdminBlogPanel() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts ?? []);
      }
    } catch {
      toast.error(t('admin.blog.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
    t,
    posts,
    loading,
    creating,
    editingId,
    setEditingId,
    slug,
    setSlug,
    title,
    setTitle,
    description,
    setDescription,
    fetchPosts,
    createPost,
    togglePublish,
  };
}

export type AdminBlogPanelState = ReturnType<typeof useAdminBlogPanel>;
