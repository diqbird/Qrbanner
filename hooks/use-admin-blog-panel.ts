'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { useAdminBlogFetch } from '@/hooks/use-admin-blog-fetch';
import { useAdminBlogMutations } from '@/hooks/use-admin-blog-mutations';

export function useAdminBlogPanel() {
  const { t } = useLanguage();
  const { posts, loading, fetchPosts } = useAdminBlogFetch(t);
  const mutations = useAdminBlogMutations({ t, fetchPosts });

  return {
    t,
    posts,
    loading,
    fetchPosts,
    ...mutations,
  };
}

export type AdminBlogPanelState = ReturnType<typeof useAdminBlogPanel>;
