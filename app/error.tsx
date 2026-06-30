'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { PublicFooter } from '@/components/public-footer';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error('[app-error]', error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-background">
      <PublicHeader />
      <main id="main-content" className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {t('common.errorTitle')}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">{t('common.errorDesc')}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => reset()}>
            {t('common.tryAgain')}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">{t('common.backHome')}</Link>
          </Button>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
