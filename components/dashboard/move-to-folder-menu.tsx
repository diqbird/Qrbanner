'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';

type MoveToFolderMenuProps = {
  qrId: string;
  folders: QRFolderOption[];
  currentFolderId?: string | null;
  onMoved: () => void;
};

export function MoveToFolderMenu({ qrId, folders, currentFolderId, onMoved }: MoveToFolderMenuProps) {
  const { t } = useLanguage();

  const move = async (folderId: string | null) => {
    try {
      const res = await fetch('/api/qr/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrIds: [qrId], folderId }),
      });
      if (!res.ok) return toast.error(t('folders.moveFailed'));
      toast.success(folderId ? t('folders.movedToFolder') : t('folders.removedFromFolder'));
      onMoved();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 h-8">
          <FolderOpen className="h-3.5 w-3.5" /> {t('folders.move')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => move(null)} disabled={!currentFolderId}>
          {t('folders.removeFromFolder')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {folders.length === 0 ? (
          <DropdownMenuItem disabled>{t('folders.noFoldersYet')}</DropdownMenuItem>
        ) : (
          folders.map((f) => (
            <DropdownMenuItem key={f.id} onClick={() => move(f.id)} disabled={currentFolderId === f.id}>
              <span className="mr-2 h-2 w-2 rounded-full inline-block" style={{ backgroundColor: f.color }} />
              {f.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
