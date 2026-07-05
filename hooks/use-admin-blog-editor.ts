'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { BlogSection } from '@/lib/blog/types';
import { emptyBlogSection, type BlogPostRecord } from '@/lib/blog-editor-utils';

export function useAdminBlogEditor({
  postId,
  onClose,
  onSaved,
}: {
  postId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<number | 'new' | null>(null);
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

  const updateSection = (index: number, next: BlogSection) => {
    if (!post) return;
    const sections = [...post.sections];
    sections[index] = next;
    setPost({ ...post, sections });
  };

  const removeSection = (index: number) => {
    if (!post) return;
    setPost({ ...post, sections: post.sections.filter((_, i) => i !== index) });
  };

  const addSection = (type: BlogSection['type']) => {
    if (!post) return;
    setPost({ ...post, sections: [...post.sections, emptyBlogSection(type)] });
  };

  const insertImage = (url: string) => {
    if (!post) return;
    const section: BlogSection = { type: 'img', src: url, alt: post.title };
    if (mediaTarget === 'new') {
      setPost({ ...post, sections: [...post.sections, section] });
    } else if (typeof mediaTarget === 'number') {
      updateSection(mediaTarget, section);
    }
    setMediaTarget(null);
    setMediaOpen(false);
  };

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

  return {
    t,
    loading,
    saving,
    deleting,
    mediaOpen,
    setMediaOpen,
    mediaTarget,
    setMediaTarget,
    post,
    setPost,
    updateSection,
    removeSection,
    addSection,
    insertImage,
    save,
    deletePost,
    onClose,
  };
}

export type AdminBlogEditorState = ReturnType<typeof useAdminBlogEditor>;
