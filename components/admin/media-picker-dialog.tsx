'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/components/i18n/language-provider';
import { useMediaPickerAssets } from '@/hooks/use-media-picker-assets';
import { MediaPickerGrid } from './media-picker-grid';

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  titleKey?: string;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  titleKey = 'admin.blog.pickImage',
}: MediaPickerDialogProps) {
  const { t } = useLanguage();
  const { assets, loading } = useMediaPickerAssets(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        ) : assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('settings.mediaLibrary.empty')}</p>
        ) : (
          <MediaPickerGrid assets={assets} onSelect={onSelect} />
        )}
      </DialogContent>
    </Dialog>
  );
}
