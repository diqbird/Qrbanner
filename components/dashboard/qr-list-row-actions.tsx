'use client';

import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import { MoveToFolderMenu } from './folder-manager';
import { QrListRowScanCount } from './qr-list-row-scan-count';
import { QrListRowMenu } from './qr-list-row-menu';
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
  return (
    <div className="flex shrink-0 items-center gap-2">
      <QrListRowScanCount qr={qr} />
      <MoveToFolderMenu
        qrId={qr.id}
        folders={folders}
        currentFolderId={qr.folderId}
        onMoved={onFoldersRefresh}
      />
      <QrListRowMenu
        qr={qr}
        folders={folders}
        onMoveToFolder={onMoveToFolder}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    </div>
  );
}
