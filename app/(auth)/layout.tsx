'use client';

import Link from 'next/link';
import { SiteLogo } from '@/components/brand/site-logo';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const localePath = useLocalePath();

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(0,0,0,0.06),transparent_55%)] dark:bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.07),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[42vh] bg-gradient-to-t from-muted/50 to-transparent dark:from-muted/20"
        aria-hidden
      />

      <header className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
        <Link
          href={localePath('/')}
          className="rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('common.homeAria')}
        >
          <SiteLogo layout="inline" />
        </Link>
        <div className="flex items-center gap-0.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4 sm:pt-8">
        {children}
      </main>
    </div>
  );
}
