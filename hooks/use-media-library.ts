'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { MediaItem } from '@/lib/media-library-types';

export function useMediaLibrary() {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('settings.mediaLibrary.uploadFailed'));
        return;
      }
      toast.success(t('settings.mediaLibrary.uploaded'));
      fetchAssets();
    } catch {
      toast.error(t('settings.mediaLibrary.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    const full = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full).then(() => toast.success(t('settings.mediaLibrary.urlCopied')));
  };

  const deleteAsset = async (id: string) => {
    if (!window.confirm(t('settings.mediaLibrary.deleteConfirm'))) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error(t('settings.mediaLibrary.deleteFailed'));
        return;
      }
      toast.success(t('settings.mediaLibrary.deleted'));
      fetchAssets();
    } catch {
      toast.error(t('settings.mediaLibrary.deleteFailed'));
    }
  };

  return {
    t,
    fileRef,
    assets,
    loading,
    uploading,
    upload,
    copyUrl,
    deleteAsset,
  };
}

export type MediaLibraryState = ReturnType<typeof useMediaLibrary>;
