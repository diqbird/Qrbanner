'use client';

import { Badge } from '@/components/ui/badge';
import { QrCode, Star, FolderOpen } from 'lucide-react';
import { categoryShortName } from '@/lib/qr-utils';
import { useLanguage } from '@/components/i18n/language-provider';
import type { QRCodeItem } from '@/lib/qr-list-row-types';

export function QrListRowInfo({
  qr,
  selected,
  onToggleSelect,
  onToggleFavorite,
}: {
  qr: QRCodeItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}) {
  const { t } = useLanguage();

  return (
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
  );
}
