'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
}

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export function MediaPickerDialog({ open, onOpenChange, onSelect }: MediaPickerDialogProps) {
  const { t } = useLanguage();
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchAssets();
  }, [open, fetchAssets]);

  const fullUrl = (url: string) => (url.startsWith('http') ? url : `${window.location.origin}${url}`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.blog.pickImage')}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        ) : assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('settings.mediaLibrary.empty')}</p>
        ) : (
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
        )}
        <p className="text-xs text-muted-foreground">{t('admin.blog.pickImageHint')}</p>
        {assets[0] ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              navigator.clipboard.writeText(fullUrl(assets[0].url));
              toast.success(t('settings.mediaLibrary.urlCopied'));
            }}
          >
            <Copy className="h-3 w-3" /> {t('settings.mediaLibrary.copyUrl')}
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
