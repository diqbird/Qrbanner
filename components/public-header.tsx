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
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        header.scrolled
          ? 'border-b border-border/50 bg-background/72 backdrop-blur-2xl shadow-sm'
          : 'border-b border-transparent bg-background/40 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-[52px] max-w-[1080px] items-center justify-between px-4 sm:h-14 sm:px-6">
        <Link
          href={localePath('/')}
          className="rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('common.homeAria')}
        >
          <SiteLogo layout="stacked" className="items-start sm:items-center" />
        </Link>

        <PublicHeaderNav header={header} />
        <PublicHeaderActions header={header} />

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
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
