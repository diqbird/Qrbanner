'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { FOLDER_COLORS } from '@/lib/organize-utils';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import { useFolderCreateActions, useFolderEditActions } from '@/hooks/use-folder-manager-actions';

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

  const { createFolder: createFolderInner } = useFolderCreateActions({
    t,
    onSelectFolder,
    onFoldersChange,
    setCreateOpen,
    setNewName,
    setCreating,
  });

  const { saveEdit: saveEditInner, deleteFolder } = useFolderEditActions({
    t,
    activeFolderId,
    onSelectFolder,
    onFoldersChange,
    setEditFolder,
  });

  const createFolder = async () => createFolderInner(newName, newColor);
  const saveEdit = async () => {
    if (!editFolder) return;
    await saveEditInner(editFolder, editName, editColor);
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
