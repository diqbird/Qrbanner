'use client';

import { toast } from 'sonner';
import { normalizeFolderName } from '@/lib/organize-utils';

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function useFolderCreateActions({
  t,
  onSelectFolder,
  onFoldersChange,
  setCreateOpen,
  setNewName,
  setCreating,
}: {
  t: Translate;
  onSelectFolder: (folderId: string | null, unfiled?: boolean) => void;
  onFoldersChange: () => void;
  setCreateOpen: (open: boolean) => void;
  setNewName: (name: string) => void;
  setCreating: (creating: boolean) => void;
}) {
  const createFolder = async (newName: string, newColor: string) => {
    const name = normalizeFolderName(newName);
    if (!name) return toast.error(t('folders.enterName'));
    setCreating(true);
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color: newColor }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error ?? t('folders.createFailed'));
      toast.success(t('folders.created'));
      setCreateOpen(false);
      setNewName('');
      onFoldersChange();
      onSelectFolder(data.folder.id);
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setCreating(false);
    }
  };

  return { createFolder };
}

export function useFolderEditActions({
  t,
  activeFolderId,
  onSelectFolder,
  onFoldersChange,
  setEditFolder,
}: {
  t: Translate;
  activeFolderId: string | null;
  onSelectFolder: (folderId: string | null, unfiled?: boolean) => void;
  onFoldersChange: () => void;
  setEditFolder: (folder: import('@/components/qr/qr-organize-settings').QRFolderOption | null) => void;
}) {
  const saveEdit = async (
    editFolder: import('@/components/qr/qr-organize-settings').QRFolderOption,
    editName: string,
    editColor: string,
  ) => {
    const name = normalizeFolderName(editName);
    if (!name) return toast.error(t('folders.enterName'));
    try {
      const res = await fetch(`/api/folders/${editFolder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color: editColor }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error ?? t('folders.updateFailed'));
      toast.success(t('folders.updated'));
      setEditFolder(null);
      onFoldersChange();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const deleteFolder = async (folder: import('@/components/qr/qr-organize-settings').QRFolderOption) => {
    if (!confirm(t('folders.deleteConfirm', { name: folder.name }))) return;
    try {
      const res = await fetch(`/api/folders/${folder.id}`, { method: 'DELETE' });
      if (!res.ok) return toast.error(t('folders.deleteFailed'));
      toast.success(t('folders.deleted'));
      if (activeFolderId === folder.id) onSelectFolder(null);
      onFoldersChange();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  return { saveEdit, deleteFolder };
}
