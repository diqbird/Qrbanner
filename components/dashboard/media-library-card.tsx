'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryCard() {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('settings.mediaLibrary.uploadFailed'));
        return;
      }
      toast.success(t('settings.mediaLibrary.uploaded'));
      fetchAssets();
    } catch {
      toast.error(t('settings.mediaLibrary.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    const full = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full).then(() => toast.success(t('settings.mediaLibrary.urlCopied')));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <ImageIcon className="h-5 w-5 text-primary" /> {t('settings.mediaLibrary.title')}
        </CardTitle>
        <CardDescription>{t('settings.mediaLibrary.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <Button
            variant="outline"
            className="gap-2"
            loading={uploading}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" /> {t('settings.mediaLibrary.upload')}
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        ) : assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('settings.mediaLibrary.empty')}</p>
        ) : (
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
                <p className="text-[10px] text-muted-foreground">{formatBytes(a.sizeBytes)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-7 gap-1 text-xs"
                  onClick={() => copyUrl(a.url)}
                >
                  <Copy className="h-3 w-3" /> {t('settings.mediaLibrary.copyUrl')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
