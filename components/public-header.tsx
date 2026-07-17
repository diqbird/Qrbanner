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
          'mx-auto flex h-[52px] max-w-[1080px] items-center justify-between rounded-2xl px-3 sm:h-14 sm:px-4',
          'border border-white/35 bg-background/65 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.45)_inset] backdrop-blur-2xl',
          'dark:border-white/10 dark:bg-background/55 dark:shadow-[0_22px_60px_-24px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.08)_inset]',
          header.scrolled && 'shadow-[0_22px_60px_-20px_rgba(0,0,0,0.55)]',
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
