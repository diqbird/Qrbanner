'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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
  QrCode,
  BarChart3,
  Trash2,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Star,
  FolderOpen,
} from 'lucide-react';
import { categoryShortName } from '@/lib/qr-utils';
import type { QRFolderOption } from '@/components/qr/qr-organize-settings';
import { MoveToFolderMenu } from './folder-manager';
import { useLanguage } from '@/components/i18n/language-provider';

export interface QRCodeItem {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  targetUrl: string;
  isActive: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  totalScans: number;
  batchId?: string | null;
  batchLabel?: string | null;
  folderId?: string | null;
  labels?: string[];
  folder?: { id: string; name: string; color: string } | null;
  createdAt: string;
}

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
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="flex min-w-0 items-center gap-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(qr.id)}
          className="h-4 w-4 rounded border-border"
          aria-label={`Select ${qr.name}`}
        />
        <button
          type="button"
          onClick={() => onToggleFavorite(qr.id, !!qr.isFavorite)}
          className="shrink-0 text-muted-foreground hover:text-amber-500"
        >
          <Star className={`h-4 w-4 ${qr.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
        </button>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: qr.folder ? `${qr.folder.color}20` : undefined }}
        >
          <QrCode className="h-5 w-5" style={{ color: qr.folder?.color ?? undefined }} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-medium">{qr.name}</h4>
            <Badge variant={qr.isActive ? 'default' : 'secondary'} className="text-xs">
              {qr.isArchived
                ? t('dashboard.statusArchived')
                : qr.isActive
                  ? t('dashboard.statusActive')
                  : t('dashboard.statusInactive')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {categoryShortName(qr.category)}
            </Badge>
            {qr.folder && (
              <Badge variant="secondary" className="gap-1 text-xs" style={{ borderColor: qr.folder.color }}>
                <FolderOpen className="h-3 w-3" style={{ color: qr.folder.color }} />
                {qr.folder.name}
              </Badge>
            )}
            {qr.batchLabel && <Badge variant="secondary" className="text-xs">{qr.batchLabel}</Badge>}
            {(qr.labels ?? []).map((label) => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
          <p className="mt-0.5 max-w-[320px] truncate text-xs text-muted-foreground">{qr.targetUrl}</p>
        </div>
      </div>
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
    </div>
  );
}
