'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Menu, X, Calendar, Search } from 'lucide-react';
import { SiteLogo } from '@/components/brand/site-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { pathsMatchLocalized } from '@/lib/i18n/locale-path';
import { demoBookingUrl } from '@/lib/site-contact';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SiteSearchDialog, useSiteSearchShortcut } from '@/components/search/site-search-dialog';

const NAV_LINKS = [
  { href: '/features', key: 'nav.features' },
  { href: '/solutions', key: 'nav.solutions' },
  { href: '/use-cases', key: 'nav.useCases' },
  { href: '/templates', key: 'nav.templates' },
  { href: '/integrations', key: 'nav.integrations' },
  { href: '/pricing', key: 'nav.pricing' },
  { href: '/blog', key: 'nav.blog' },
  { href: '/faq', key: 'nav.faq' },
] as const;

export function PublicHeader() {
  const { t } = useLanguage();
  const localePath = useLocalePath();
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const demoUrl = demoBookingUrl();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  useSiteSearchShortcut(openSearch);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/50 bg-background/72 backdrop-blur-2xl shadow-sm'
          : 'border-b border-transparent bg-background/40 backdrop-blur-md'
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

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t('nav.mainNav')}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={localePath(link.href)}
              className={cn(
                'rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                pathsMatchLocalized(pathname, link.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-[13px] text-muted-foreground"
            onClick={openSearch}
            aria-label={t('siteSearch.open')}
          >
            <Search className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden xl:inline">{t('siteSearch.open')}</span>
            <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline">
              ⌘K
            </kbd>
          </Button>
          <LanguageSwitcher />
          <ThemeToggle />
          {!session && (
            <Link href={demoUrl}>
              <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-[13px] gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                {t('nav.bookDemo')}
              </Button>
            </Link>
          )}
          {session ? (
            <Link href="/dashboard" className="ml-1">
              <Button variant="default" size="sm" className="h-8 rounded-full px-4 text-[13px]">
                <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                {t('common.dashboard')}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/qr/create?quick=1" className="ml-1">
                <Button size="sm" className="h-8 rounded-full px-4 text-[13px]">
                  {t('nav.createQr')}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-[13px]">
                  {t('common.signIn')}
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <nav
            id="mobile-nav"
            className="absolute left-0 right-0 top-full z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl lg:hidden"
            aria-label={t('nav.mobileNav')}
          >
            <div className="mx-auto max-w-[1080px] space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={localePath(link.href)}
                  className={cn(
                    'block rounded-xl px-4 py-3 text-[15px] font-medium transition-colors',
                    pathsMatchLocalized(pathname, link.href)
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {session ? (
                  <Link href="/dashboard">
                    <Button className="w-full rounded-xl">{t('common.dashboard')}</Button>
                  </Link>
                ) : (
                  <>
                    <Link href={demoUrl}>
                      <Button variant="outline" className="w-full rounded-xl gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('nav.bookDemo')}
                      </Button>
                    </Link>
                    <Link href="/qr/create?quick=1">
                      <Button className="w-full rounded-xl">{t('nav.createQr')}</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="w-full rounded-xl">
                        {t('common.signIn')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </>
      )}
      <SiteSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
