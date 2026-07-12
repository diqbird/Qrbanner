'use client';

import { useMemo } from 'react';
import { Smartphone } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { renderLandingPage, type LandingPageData } from '@/lib/landing-page';

export function LandingPagePreview({
  data,
  qrName,
}: {
  data: LandingPageData;
  qrName?: string;
}) {
  const { t, locale } = useLanguage();

  const html = useMemo(
    () =>
      renderLandingPage('preview', data, '#', {
        qrName,
        preview: true,
        locale,
      }),
    [data, qrName, locale],
  );

  return (
    <div
      className="rounded-lg border border-border/60 bg-muted/20 p-3"
      data-testid="landing-page-preview"
    >
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Smartphone className="h-3.5 w-3.5" />
        {t('landingEditor.livePreview')}
      </p>
      <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[1.75rem] border-[3px] border-border bg-background shadow-md">
        <iframe
          title={t('landingEditor.previewFrameTitle')}
          srcDoc={html}
          className="h-[460px] w-full border-0 bg-white"
          sandbox="allow-same-origin"
        />
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">{t('landingEditor.previewHint')}</p>
    </div>
  );
}
