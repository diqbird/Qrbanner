'use client';

import { Upload } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { MockupPreviewState } from '@/hooks/use-mockup-preview';

export function MockupCanvasBackground({
  backgroundImage,
  fileInputRef,
}: {
  backgroundImage: string | null;
  fileInputRef: MockupPreviewState['fileInputRef'];
}) {
  const { t } = useLanguage();

  if (backgroundImage) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/10" aria-hidden />
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/80 p-4 text-center text-sm text-muted-foreground hover:bg-muted"
    >
      <Upload className="h-8 w-8 opacity-50" />
      <span>{t('mockup.uploadPhoto')}</span>
    </button>
  );
}
