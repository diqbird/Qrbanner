import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import Link from 'next/link';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('aboutPage.metaTitle'),
    description: t('aboutPage.metaDescription'),
    path: '/about',
  });
}

const PROMISE_KEYS = ['aboutPage.promise1', 'aboutPage.promise2', 'aboutPage.promise3', 'aboutPage.promise4'] as const;

export default async function AboutPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('aboutPage.title'),
          description: t('aboutPage.intro'),
          path: '/about',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('footer.about'), href: '/about' }]} />
      <div className="py-10 sm:py-16">
        <article className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
          <header>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('aboutPage.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{t('aboutPage.intro')}</p>
          </header>

          <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <h2 className="font-display text-xl font-semibold text-foreground">{t('aboutPage.whatWeDoTitle')}</h2>
            <p>{t('aboutPage.whatWeDo1')}</p>
            <p>{t('aboutPage.whatWeDo2')}</p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <h2 className="font-display text-xl font-semibold text-foreground">{t('aboutPage.promiseTitle')}</h2>
            <ul className="list-disc space-y-2 pl-5">
              {PROMISE_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/qr/create?quick=1"
              className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              {t('aboutPage.ctaCreate')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {t('aboutPage.ctaContact')}
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
