'use client';

import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd } from '@/lib/seo';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';

export function PublicBreadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const { t, locale } = useLanguage();
  const localePath = useLocalePath();
  const trail = [{ label: t('common.home'), href: '/' }, ...items];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          trail.map((item) => ({ name: item.label, path: item.href })),
          locale
        )}
      />
      <nav
        aria-label={t('common.breadcrumbAria')}
        className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6"
      >
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            const href = localePath(item.href);
            return (
              <li key={`${item.href}-${index}`} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
