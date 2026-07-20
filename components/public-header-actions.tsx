'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Calendar, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useLanguage } from '@/components/i18n/language-provider';
import { demoBookingUrl } from '@/lib/site-contact';
import type { PublicHeaderState } from '@/hooks/use-public-header';

const ghostBtn =
  'h-8 gap-1.5 rounded-sm px-2.5 text-[13px] font-medium tracking-tight text-[var(--jt-ink,#1C1917)]/70 hover:bg-[var(--jt-ink,#1C1917)]/[0.06] hover:text-[var(--jt-ink,#1C1917)]';

const primaryBtn =
  'h-8 rounded-sm bg-[var(--jt-ultramarine,#2430C8)] px-4 text-[13px] font-medium tracking-tight text-white shadow-none hover:brightness-110';

export function PublicHeaderActions({ header }: { header: PublicHeaderState }) {
  const { t } = useLanguage();
  const { data: session } = useSession() || {};
  const { openSearch } = header;
  const demoUrl = demoBookingUrl();

  return (
    <div className="hidden items-center gap-0.5 lg:flex">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={ghostBtn}
        onClick={openSearch}
        aria-label={t('siteSearch.open')}
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden xl:inline">{t('siteSearch.open')}</span>
        <kbd className="pointer-events-none hidden h-5 items-center rounded-sm border border-[var(--jt-rule,#D6CFC0)] bg-[var(--jt-tint,#EBE4D6)] px-1.5 font-mono text-[10px] font-medium text-[var(--jt-ink,#1C1917)]/55 sm:inline-flex">
          ⌘K
        </kbd>
      </Button>
      <LanguageSwitcher />
      <ThemeToggle />
      {!session && (
        <Link href={demoUrl}>
          <Button variant="ghost" size="sm" className={`${ghostBtn} gap-1.5`}>
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            {t('nav.bookDemo')}
          </Button>
        </Link>
      )}
      {session ? (
        <Link href="/dashboard" className="ml-1">
          <Button size="sm" className={primaryBtn}>
            <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {t('common.dashboard')}
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/qr/create?quick=1" className="ml-1.5">
            <Button size="sm" className={primaryBtn}>
              {t('nav.createQr')}
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className={ghostBtn}>
              {t('common.signIn')}
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
