'use client';

export type { QRCodeItem } from '@/lib/qr-list-row-types';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import type { QRCodeItem } from '@/lib/qr-list-row-types';
import { QrListRowInfo } from './qr-list-row-info';
import { QrListRowActions } from './qr-list-row-actions';

export function QrListRow({
  qr,
  selected,
  folders,
  onToggleSelect,
  onToggleFavorite,
  onMoveToFolder,
  onDuplicate,
  onDelete,
  onFoldersRefresh,
}: {
  qr: QRCodeItem;
  selected: boolean;
  folders: QRFolderOption[];
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  onMoveToFolder: (qrId: string, folderId: string | null) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onFoldersRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 transition-colors hover:bg-muted/30">
      <QrListRowInfo
        qr={qr}
        selected={selected}
        onToggleSelect={onToggleSelect}
        onToggleFavorite={onToggleFavorite}
      />
      <QrListRowActions
        qr={qr}
        folders={folders}
        onMoveToFolder={onMoveToFolder}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onFoldersRefresh={onFoldersRefresh}
      />
    </div>
  );
}
