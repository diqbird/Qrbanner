'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { FOLDER_COLORS, normalizeFolderName } from '@/lib/organize-utils';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';

export function useFolderManager({
  activeFolderId,
  onSelectFolder,
  onFoldersChange,
}: {
  activeFolderId: string | null;
  onSelectFolder: (folderId: string | null, unfiled?: boolean) => void;
  onFoldersChange: () => void;
}) {
  const { t } = useLanguage();
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(FOLDER_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [editFolder, setEditFolder] = useState<QRFolderOption | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState(FOLDER_COLORS[0]);

  const createFolder = async () => {
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

  const saveEdit = async () => {
    if (!editFolder) return;
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

  const deleteFolder = async (folder: QRFolderOption) => {
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

  const openEdit = (folder: QRFolderOption) => {
    setEditFolder(folder);
    setEditName(folder.name);
    setEditColor(folder.color);
  };

  return {
    t,
    createOpen,
    setCreateOpen,
    newName,
    setNewName,
    newColor,
    setNewColor,
    creating,
    editFolder,
    setEditFolder,
    editName,
    setEditName,
    editColor,
    setEditColor,
    createFolder,
    saveEdit,
    deleteFolder,
    openEdit,
  };
}

export type FolderManagerState = ReturnType<typeof useFolderManager>;
