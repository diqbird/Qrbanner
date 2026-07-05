'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useQrListItemActions({
  t,
  fetchQRCodes,
  refreshFoldersAndList,
}: {
  t: Translate;
  fetchQRCodes: () => Promise<void>;
  refreshFoldersAndList: () => void;
}) {
  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm(t('dashboard.deleteConfirm'))) return;
      try {
        const res = await fetch(`/api/qr/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success(t('dashboard.deletedSuccess'));
          refreshFoldersAndList();
        } else {
          toast.error(t('dashboard.deleteFailed'));
        }
      } catch {
        toast.error(t('auth.somethingWrong'));
      }
    },
    [t, refreshFoldersAndList],
  );

  const handleDuplicate = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/qr/${id}?action=duplicate`, { method: 'POST' });
        if (res.ok) {
          toast.success(t('dashboard.duplicatedSuccess'));
          refreshFoldersAndList();
        } else {
          toast.error(t('dashboard.duplicateFailed'));
        }
      } catch {
        toast.error(t('auth.somethingWrong'));
      }
    },
    [t, refreshFoldersAndList],
  );

  const moveToFolder = useCallback(
    async (qrId: string, folderId: string | null) => {
      try {
        const res = await fetch('/api/qr/organize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qrIds: [qrId], folderId }),
        });
        if (!res.ok) return toast.error(t('dashboard.moveFailed'));
        toast.success(folderId ? t('dashboard.movedToFolder') : t('dashboard.removedFromFolder'));
        refreshFoldersAndList();
      } catch {
        toast.error(t('auth.somethingWrong'));
      }
    },
    [t, refreshFoldersAndList],
  );

  const toggleFavorite = useCallback(
    async (id: string, current: boolean) => {
      const res = await fetch('/api/qr/bulk-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: current ? 'unfavorite' : 'favorite', ids: [id] }),
      });
      if (res.ok) fetchQRCodes();
      else toast.error(t('dashboard.favoriteFailed'));
    },
    [t, fetchQRCodes],
  );

  return { handleDelete, handleDuplicate, moveToFolder, toggleFavorite };
}
