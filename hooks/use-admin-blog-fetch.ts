'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { AdminBlogPost } from '@/lib/admin-blog-panel-types';

export function useAdminBlogFetch(t: (key: string) => string) {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { posts, loading, fetchPosts };
}
