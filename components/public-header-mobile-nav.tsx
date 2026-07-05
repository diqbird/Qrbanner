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
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={localePath(link.href)}
              className={cn(
                'block rounded-xl px-4 py-3 text-[15px] font-medium transition-colors',
                pathsMatchLocalized(pathname, link.href)
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
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
  );
}
