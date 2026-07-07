'use client';

import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';
import { formatMediaBytes } from '@/lib/media-library-types';
import type { MediaLibraryState } from '@/hooks/use-media-library';

export function MediaLibraryAssetGrid({ library }: { library: MediaLibraryState }) {
  const { t, locale, assets, copyUrl, deleteAsset } = library;

  if (assets.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('settings.mediaLibrary.empty')}</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((a) => (
        <div key={a.id} className="rounded-lg border border-border/50 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.url}
            alt={a.filename}
            className="aspect-video w-full rounded-md object-cover bg-muted"
            loading="lazy"
            decoding="async"
          />
          <p className="mt-2 truncate text-xs font-medium">{a.filename}</p>
          <p className="text-[10px] text-muted-foreground">{formatMediaBytes(a.sizeBytes, locale)}</p>
          <div className="mt-1 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => copyUrl(a.url)}
            >
              <Copy className="h-3 w-3" /> {t('settings.mediaLibrary.copyUrl')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
              onClick={() => deleteAsset(a.id)}
            >
              <Trash2 className="h-3 w-3" /> {t('settings.mediaLibrary.delete')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
