'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { pathsMatchLocalized } from '@/lib/i18n/locale-path';
import { PUBLIC_NAV_LINKS } from '@/lib/public-nav-links';
import { cn } from '@/lib/utils';
import type { PublicHeaderState } from '@/hooks/use-public-header';

export function PublicHeaderNav({ header }: { header: PublicHeaderState }) {
  const { t } = useLanguage();
  const localePath = useLocalePath();
  const { pathname } = header;

  return (
    <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t('nav.mainNav')}>
      {PUBLIC_NAV_LINKS.map((link) => {
        const active = pathsMatchLocalized(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={localePath(link.href)}
            className={cn(
              'nav-pill-3d',
              active ? 'nav-pill-3d-active text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(link.key)}
          </Link>
        );
      })}
    </nav>
  );
}
