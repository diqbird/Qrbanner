'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useMemo } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { buildPublicFooterSections, type FooterSection } from '@/lib/public-footer-links';

export function PublicFooterNav({ sections }: { sections: FooterSection[] }) {
  const localePath = useLocalePath();

  return (
    <div className="grid min-w-0 flex-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {sections.map((section) => (
        <nav key={section.title} aria-label={section.title} className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{section.title}</p>
          <ul className="mt-3 space-y-2">
            {section.links.map((link) => (
              <li key={link.href} className="min-w-0">
                {link.external ? (
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="py-1 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 break-words"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={localePath(link.href)}
                    className="inline-block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors break-words"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}

export function usePublicFooterSections() {
  const { t, locale } = useLanguage();
  return useMemo(() => buildPublicFooterSections(t, locale), [t, locale]);
}
