'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { pathsMatchLocalized } from '@/lib/i18n/locale-path';
import { PUBLIC_NAV_LINKS } from '@/lib/public-nav-links';
import { demoBookingUrl } from '@/lib/site-contact';
import { cn } from '@/lib/utils';
import type { PublicHeaderState } from '@/hooks/use-public-header';

export function PublicHeaderMobileNav({ header }: { header: PublicHeaderState }) {
  const { t } = useLanguage();
  const localePath = useLocalePath();
  const { data: session } = useSession() || {};
  const { pathname, mobileOpen, setMobileOpen } = header;
  const demoUrl = demoBookingUrl();

  if (!mobileOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 top-0 z-40 bg-background/55 backdrop-blur-md lg:hidden"
        aria-hidden
        onClick={() => setMobileOpen(false)}
      />
      <nav
        id="mobile-nav"
        className="menu-3d absolute left-3 right-3 top-[calc(100%-0.25rem)] z-50 mt-2 overflow-hidden lg:hidden"
        aria-label={t('nav.mobileNav')}
      >
        <div className="mx-auto max-w-[1080px] space-y-1.5 px-3 py-4">
          {PUBLIC_NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={localePath(link.href)}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'menu-item-3d block rounded-xl px-4 py-3.5 text-[15px] font-semibold tracking-tight transition-all',
                'border border-transparent',
                pathsMatchLocalized(pathname, link.href)
                  ? 'border-white/25 bg-foreground/[0.08] text-foreground shadow-[0_12px_28px_-16px_rgba(0,0,0,0.45)]'
                  : 'text-muted-foreground hover:border-white/20 hover:bg-foreground/[0.05] hover:text-foreground',
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {t(link.key)}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            {session ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-xl shadow-[0_14px_34px_-14px_hsl(var(--primary)/0.7)]">
                  {t('common.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                <Link href={demoUrl} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl gap-2 surface-3d">
                    <Calendar className="h-4 w-4" />
                    {t('nav.bookDemo')}
                  </Button>
                </Link>
                <Link href="/qr/create?quick=1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-xl shadow-[0_14px_34px_-14px_hsl(var(--primary)/0.7)]">
                    {t('nav.createQr')}
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl surface-3d">
                    {t('common.signIn')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
