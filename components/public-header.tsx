'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Menu, X, Calendar } from 'lucide-react';
import { SiteLogo } from '@/components/brand/site-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useLanguage } from '@/components/i18n/language-provider';
import { demoBookingUrl } from '@/lib/site-contact';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/features', key: 'nav.features' },
  { href: '/solutions', key: 'nav.solutions' },
  { href: '/integrations', key: 'nav.integrations' },
  { href: '/pricing', key: 'nav.pricing' },
  { href: '/blog', key: 'nav.blog' },
  { href: '/faq', key: 'nav.faq' },
] as const;

export function PublicHeader() {
  const { t } = useLanguage();
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const demoUrl = demoBookingUrl();

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
          href="/"
          className="rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('common.homeAria')}
        >
          <SiteLogo layout="stacked" className="items-start sm:items-center" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t('nav.mainNav')}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
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
                  href={link.href}
                  className={cn(
                    'block rounded-xl px-4 py-3 text-[15px] font-medium transition-colors',
                    pathname === link.href
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
    </header>
  );
}
