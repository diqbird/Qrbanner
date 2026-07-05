'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import type { MediaItem } from '@/hooks/use-media-picker-assets';
import { mediaPickerFullUrl } from '@/hooks/use-media-picker-assets';

export function MediaPickerGrid({
  assets,
  onSelect,
}: {
  assets: MediaItem[];
  onSelect: (url: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {assets.map((a) => (
          <button
            key={a.id}
            type="button"
            className="rounded-lg border border-border/50 p-2 text-left transition-colors hover:border-primary/40"
            onClick={() => onSelect(a.url)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.url}
              alt={a.filename}
              className="aspect-video w-full rounded-md object-cover bg-muted"
            />
            <p className="mt-2 truncate text-xs font-medium">{a.filename}</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t('admin.blog.pickImageHint')}</p>
      {assets[0] ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            navigator.clipboard.writeText(mediaPickerFullUrl(assets[0].url));
            toast.success(t('settings.mediaLibrary.urlCopied'));
          }}
        >
          <Copy className="h-3 w-3" /> {t('settings.mediaLibrary.copyUrl')}
        </Button>
      ) : null}
    </>
  );
}
