import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  FEATURED_USE_CASE_SLUGS,
  getUseCaseBySlug,
} from '@/lib/use-case-pages';
import { localizeUseCasePage } from '@/lib/i18n/resolve-programmatic-copy';
import { solutionIcon } from '@/lib/solution-icons';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';

export async function LandingUseCasesSection() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  const featured = FEATURED_USE_CASE_SLUGS.map((slug) => {
    const page = getUseCaseBySlug(slug);
    return page ? localizeUseCasePage(page, locale) : null;
  }).filter(Boolean);

  return (
    <section className="py-16 sm:py-20 bg-muted/20" aria-labelledby="use-cases-heading">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="use-cases-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('useCasesTeaser.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('useCasesTeaser.subtitle')}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((page) => {
            if (!page) return null;
            const Icon = solutionIcon(page.icon);
            return (
              <Link
                key={page.slug}
                href={localizePath(`/use-cases/${page.slug}`, locale)}
                className="group flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl icon-well-primary-hover">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-display font-semibold line-clamp-2">{page.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {page.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t('useCasesTeaser.learnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t('useCasesTeaser.alsoBrowse')}{' '}
          <Link href={localizePath('/qr-types', locale)} className="font-medium text-primary hover:underline">
            {t('nav.qrTypes')}
          </Link>
          {' · '}
          <Link href={localizePath('/use-cases', locale)} className="font-medium text-primary hover:underline">
            {t('useCasesTeaser.viewAll')}
          </Link>
        </p>
      </div>
    </section>
  );
}
