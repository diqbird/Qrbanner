'use client';

import { useFolderManager } from '@/hooks/use-folder-manager';
import { FolderCreateDialog } from './folder-create-dialog';
import { FolderEditDialog } from './folder-edit-dialog';
import { FolderList } from './folder-list';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';

export { MoveToFolderMenu } from './move-to-folder-menu';

interface FolderManagerProps {
  folders: QRFolderOption[];
  activeFolderId: string | null;
  unfiledActive?: boolean;
  onSelectFolder: (folderId: string | null, unfiled?: boolean) => void;
  onFoldersChange: () => void;
}

export function FolderManager({
  folders,
  activeFolderId,
  unfiledActive,
  onSelectFolder,
  onFoldersChange,
}: FolderManagerProps) {
  const manager = useFolderManager({ activeFolderId, onSelectFolder, onFoldersChange });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{manager.t('folders.title')}</p>
        <FolderCreateDialog manager={manager} />
      </div>
      <FolderList
        folders={folders}
        activeFolderId={activeFolderId}
        unfiledActive={unfiledActive}
        onSelectFolder={onSelectFolder}
        manager={manager}
      />
      <FolderEditDialog manager={manager} />
    </div>
  );
}
