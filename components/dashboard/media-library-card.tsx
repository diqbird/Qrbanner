'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload } from 'lucide-react';
import { useMediaLibrary } from '@/hooks/use-media-library';
import { MediaLibraryAssetGrid } from './media-library-asset-grid';

export function MediaLibraryCard() {
  const library = useMediaLibrary();
  const { t, fileRef, loading, uploading, upload } = library;

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
        ) : (
          <MediaLibraryAssetGrid library={library} />
        )}
      </CardContent>
    </Card>
  );
}
