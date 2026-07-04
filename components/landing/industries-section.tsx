import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { FEATURED_SOLUTION_SLUGS, getSolutionBySlug } from '@/lib/solutions';
import { solutionIcon } from '@/lib/solution-icons';

export async function LandingIndustriesSection() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  const featured = FEATURED_SOLUTION_SLUGS.map((slug) => getSolutionBySlug(slug)).filter(Boolean);

  return (
    <section className="py-16 sm:py-20" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="industries-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('industries.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('industries.subtitle')}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((solution) => {
            if (!solution) return null;
            const Icon = solutionIcon(solution.icon);
            return (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                className="group flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl icon-well-primary-hover">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-display font-semibold">{solution.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {solution.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t('industries.learnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center">
          <Link href="/solutions" className="text-sm font-medium text-primary hover:underline">
            {t('industries.viewAll')}
          </Link>
        </p>
      </div>
    </section>
  );
}
