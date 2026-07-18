'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { SiteLogo } from '@/components/brand/site-logo';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { SiteSearchDialog, useSiteSearchShortcut } from '@/components/search/site-search-dialog';
import { usePublicHeader } from '@/hooks/use-public-header';
import { PublicHeaderNav } from './public-header-nav';
import { PublicHeaderActions } from './public-header-actions';
import { PublicHeaderMobileNav } from './public-header-mobile-nav';
import { cn } from '@/lib/utils';

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
          'border border-[#D6CFC0]/90 bg-[#F5F1E8]/90 shadow-[0_14px_36px_-28px_rgba(28,25,23,0.45)] backdrop-blur-xl',
          'dark:border-white/10 dark:bg-[#1C1917]/85 dark:shadow-[0_22px_60px_-24px_rgba(0,0,0,0.85)]',
          header.scrolled && 'shadow-[0_18px_44px_-22px_rgba(28,25,23,0.5)]',
        )}
      >
        <Link
          href={localePath('/')}
          className="rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('common.homeAria')}
        >
          <SiteLogo layout="inline" size="sm" />
        </Link>

        <PublicHeaderNav header={header} />
        <PublicHeaderActions header={header} />

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl lg:hidden"
          onClick={() => header.setMobileOpen(!header.mobileOpen)}
          aria-expanded={header.mobileOpen}
          aria-controls="mobile-nav"
          aria-label={header.mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          {header.mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <PublicHeaderMobileNav header={header} />
      <SiteSearchDialog open={header.searchOpen} onOpenChange={header.setSearchOpen} />
    </header>
  );
}
