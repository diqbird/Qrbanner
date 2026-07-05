'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { useStatusPageHealth } from '@/hooks/use-status-page-health';
import { StatusPageStatusPanel } from './status-page-status-panel';

export function StatusPageContent() {
  const { t } = useLanguage();
  const { health, loading, error, reload, operational } = useStatusPageHealth();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">{t('status.pageTitle')}</h1>
        <p className="mt-3 text-muted-foreground">{t('status.pageSubtitle')}</p>
      </header>

      <StatusPageStatusPanel
        t={t}
        health={health}
        loading={loading}
        error={error}
        operational={operational}
        onRetry={() => void reload()}
      />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t('status.needHelp')}{' '}
        <a href={supportMailto()} className="text-primary hover:underline">
          {SUPPORT_EMAIL}
        </a>
      </p>

      <div className="mt-6 text-center">
        <Link href="/">
          <Button variant="ghost">{t('status.backHome')}</Button>
        </Link>
      </div>
    </div>
  );
}
