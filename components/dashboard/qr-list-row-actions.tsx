'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3,
  Trash2,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  FolderOpen,
} from 'lucide-react';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import { MoveToFolderMenu } from './folder-manager';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QRCodeItem } from '@/lib/qr-list-row-types';

export function QrListRowActions({
  qr,
  folders,
  onMoveToFolder,
  onDuplicate,
  onDelete,
  onFoldersRefresh,
}: {
  qr: QRCodeItem;
  folders: QRFolderOption[];
  onMoveToFolder: (qrId: string, folderId: string | null) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onFoldersRefresh: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div className="hidden text-right sm:block">
        <p className="font-mono text-sm font-semibold">{qr.totalScans}</p>
        <p className="text-xs text-muted-foreground">{t('dashboard.scansLabel')}</p>
      </div>
      <MoveToFolderMenu
        qrId={qr.id}
        folders={folders}
        currentFolderId={qr.folderId}
        onMoved={onFoldersRefresh}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.open(`/s/${qr.shortCode}`, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" /> {t('dashboard.openLink')}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/qr/${qr.id}`}>
              <Pencil className="mr-2 h-4 w-4" /> {t('dashboard.edit')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/qr/${qr.id}/analytics`}>
              <BarChart3 className="mr-2 h-4 w-4" /> {t('dashboard.analytics')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderOpen className="mr-2 h-4 w-4" /> {t('dashboard.moveToFolder')}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onMoveToFolder(qr.id, null)} disabled={!qr.folderId}>
                {t('dashboard.removeFromFolder')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {folders.map((f) => (
                <DropdownMenuItem
                  key={f.id}
                  onClick={() => onMoveToFolder(qr.id, f.id)}
                  disabled={qr.folderId === f.id}
                >
                  {f.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => onDuplicate(qr.id)}>
            <Copy className="mr-2 h-4 w-4" /> {t('dashboard.duplicate')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(qr.id)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> {t('dashboard.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
