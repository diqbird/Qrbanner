'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <QrCode className="h-8 w-8 text-primary" />
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {t('common.notFoundTitle')}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t('common.notFoundDesc')}</p>
      <Link href="/" className="mt-8">
        <Button>{t('common.backHome')}</Button>
      </Link>
    </div>
  );
}
