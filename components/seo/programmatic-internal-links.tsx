import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  FEATURED_USE_CASE_SLUGS,
  FOOTER_USE_CASE_SLUGS,
  getUseCaseBySlug,
} from '@/lib/use-case-pages';
import { localizeUseCasePage } from '@/lib/i18n/resolve-programmatic-copy';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/types';

type Variant = 'blog' | 'compact';

export async function ProgrammaticInternalLinks({
  variant = 'blog',
  extraLinks,
}: {
  variant?: Variant;
  extraLinks?: { href: string; label: string }[];
}) {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  const slugs = variant === 'compact' ? FOOTER_USE_CASE_SLUGS : FEATURED_USE_CASE_SLUGS.slice(0, 4);
  const guides = slugs
    .map((slug) => {
      const page = getUseCaseBySlug(slug);
      return page ? localizeUseCasePage(page, locale) : null;
    })
    .filter(Boolean);

  return (
    <aside
      className={
        variant === 'blog'
          ? 'mt-14 rounded-2xl border border-border/60 bg-muted/20 p-6 sm:p-8'
          : 'rounded-xl border border-border/50 bg-muted/10 p-5'
      }
      aria-labelledby="internal-links-heading"
    >
      <h2 id="internal-links-heading" className="font-display text-lg font-semibold">
        {t('internalLinks.title')}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('internalLinks.subtitle')}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <HubLink href="/use-cases" label={t('nav.useCases')} locale={locale} />
        <HubLink href="/qr-types" label={t('nav.qrTypes')} locale={locale} />
        <HubLink href="/solutions" label={t('nav.solutions')} locale={locale} />
        <HubLink href="/templates" label={t('nav.templates')} locale={locale} />
      </div>

      <ul className="mt-5 space-y-2">
        {guides.map((page) =>
          page ? (
            <li key={page.slug}>
              <Link
                href={localizePath(`/use-cases/${page.slug}`, locale)}
                className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" aria-hidden />
                {page.title}
              </Link>
            </li>
          ) : null
        )}
        {extraLinks?.map((link) => (
          <li key={link.href}>
            <Link
              href={localizePath(link.href, locale)}
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" aria-hidden />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function HubLink({ href, label, locale }: { href: string; label: string; locale: Locale }) {
  return (
    <Link
      href={localizePath(href, locale)}
      className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
    >
      {label}
    </Link>
  );
}
