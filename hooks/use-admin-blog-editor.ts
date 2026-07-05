'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  useAdminBlogPostLoad,
  useAdminBlogSectionActions,
  useAdminBlogPostMutations,
} from '@/hooks/use-admin-blog-editor-actions';

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
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<number | 'new' | null>(null);

  const { loading, post, setPost } = useAdminBlogPostLoad({ postId, onClose, t });
  const { updateSection, removeSection, addSection, insertImage } = useAdminBlogSectionActions({
    post,
    setPost,
    mediaTarget,
    setMediaTarget,
    setMediaOpen,
  });
  const { saving, deleting, save, deletePost } = useAdminBlogPostMutations({
    postId,
    post,
    onClose,
    onSaved,
    t,
  });

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
