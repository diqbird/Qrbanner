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
