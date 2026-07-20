'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu, X } from 'lucide-react';
import { SiteLogo } from '@/components/brand/site-logo';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { useSiteSearchShortcut } from '@/hooks/use-site-search-shortcut';
import { usePublicHeader } from '@/hooks/use-public-header';
import { PublicHeaderNav } from './public-header-nav';
import { PublicHeaderActions } from './public-header-actions';
import { PublicHeaderMobileNav } from './public-header-mobile-nav';
import { cn } from '@/lib/utils';

const SiteSearchDialog = dynamic(
  () => import('@/components/search/site-search-dialog').then((m) => ({ default: m.SiteSearchDialog })),
  { ssr: false }
);

export function PublicHeader() {
  const { t } = useLanguage();
  const localePath = useLocalePath();
  const header = usePublicHeader();

  useSiteSearchShortcut(header.openSearch);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-3">
      <div
        className={cn(
          'mx-auto flex h-[52px] max-w-[1080px] items-center justify-between rounded-sm px-3 sm:h-14 sm:px-4',
          'border border-[var(--jt-rule,#D6CFC0)] bg-[var(--jt-paper,#F5F1E8)]/95 text-[var(--jt-ink,#1C1917)]',
          'shadow-[0_14px_36px_-28px_rgba(28,25,23,0.45)] backdrop-blur-xl',
          header.scrolled && 'shadow-[0_18px_44px_-22px_rgba(28,25,23,0.55)]',
        )}
      >
        <Link
          href={localePath('/')}
          className="rounded-sm outline-none ring-offset-[var(--jt-paper,#F5F1E8)] focus-visible:ring-2 focus-visible:ring-[var(--jt-ultramarine,#2430C8)]"
          aria-label={t('common.homeAria')}
        >
          <SiteLogo layout="inline" size="sm" />
        </Link>

        <PublicHeaderNav header={header} />
        <PublicHeaderActions header={header} />

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-sm text-[var(--jt-ink,#1C1917)] lg:hidden"
          onClick={() => header.setMobileOpen(!header.mobileOpen)}
          aria-expanded={header.mobileOpen}
          aria-controls="mobile-nav"
          aria-label={header.mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          {header.mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <PublicHeaderMobileNav header={header} />
      {header.searchOpen ? (
        <SiteSearchDialog open={header.searchOpen} onOpenChange={header.setSearchOpen} />
      ) : null}
    </header>
  );
}
