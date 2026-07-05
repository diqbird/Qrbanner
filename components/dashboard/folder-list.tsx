'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import type { FolderManagerState } from '@/hooks/use-folder-manager';

type FolderListProps = {
  folders: QRFolderOption[];
  activeFolderId: string | null;
  unfiledActive?: boolean;
  onSelectFolder: (folderId: string | null, unfiled?: boolean) => void;
  manager: FolderManagerState;
};

export function FolderList({
  folders,
  activeFolderId,
  unfiledActive,
  onSelectFolder,
  manager,
}: FolderListProps) {
  const { t, openEdit, deleteFolder } = manager;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectFolder(null)}
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          !activeFolderId && !unfiledActive
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:border-primary/40'
        }`}
      >
        {t('folders.all')}
      </button>
      <button
        type="button"
        onClick={() => onSelectFolder(null, true)}
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          unfiledActive
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:border-primary/40'
        }`}
      >
        {t('folders.unfiled')}
      </button>
      {folders.map((folder) => (
        <div key={folder.id} className="flex items-center">
          <button
            type="button"
            onClick={() => onSelectFolder(folder.id)}
            className={`flex items-center gap-1.5 rounded-l-lg border border-r-0 px-3 py-1.5 text-xs font-medium transition-colors ${
              activeFolderId === folder.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: folder.color }} />
            {folder.name}
            <span className="text-muted-foreground">({folder.qrCount ?? 0})</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-[30px] rounded-l-none px-1.5 ${activeFolderId === folder.id ? 'border-primary' : ''}`}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEdit(folder)}>
                <Pencil className="mr-2 h-4 w-4" /> {t('folders.rename')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deleteFolder(folder)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> {t('folders.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
