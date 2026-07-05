'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { BlogSection } from '@/lib/blog/types';
import type { BlogPostRecord } from '@/lib/blog-editor-utils';

export function useAdminBlogPostLoad({
  postId,
  onClose,
  t,
}: {
  postId: string;
  onClose: () => void;
  t: (key: string) => string;
}) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPostRecord | null>(null);

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('admin.blog.loadFailed'));
        onClose();
        return;
      }
      setPost({
        ...data.post,
        sections: (data.post.sections as BlogSection[]) ?? [],
        keywords: data.post.keywords ?? [],
      });
    } catch {
      toast.error(t('admin.blog.loadFailed'));
      onClose();
    } finally {
      setLoading(false);
    }
  }, [postId, onClose, t]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return { loading, post, setPost };
}
