import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
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
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <article className="mx-auto max-w-3xl space-y-8">
            <PublicBreadcrumbs items={[{ label: t('footer.about'), href: '/about' }]} />
            <header className="relative">
              <div className="pointer-events-none absolute -left-8 -top-8 -z-10 h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" aria-hidden />
              <p className="ph-eyebrow mb-4">{t('footer.about')}</p>
              <h1 className="ph-title text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">{t('aboutPage.title')}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('aboutPage.intro')}</p>
            </header>

            <section className="ph-card space-y-3 p-6 text-sm leading-relaxed text-muted-foreground hover:translate-y-0 hover:scale-100">
              <h2 className="ph-title text-xl text-foreground">{t('aboutPage.whatWeDoTitle')}</h2>
              <p>{t('aboutPage.whatWeDo1')}</p>
              <p>{t('aboutPage.whatWeDo2')}</p>
            </section>

            <section className="ph-card space-y-3 p-6 text-sm leading-relaxed text-muted-foreground hover:translate-y-0 hover:scale-100">
              <h2 className="ph-title text-xl text-foreground">{t('aboutPage.promiseTitle')}</h2>
              <ul className="list-disc space-y-2 pl-5">
                {PROMISE_KEYS.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            </section>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/qr/create?quick=1" prefetch={false} className="ph-btn-primary">
                {t('aboutPage.ctaCreate')}
              </Link>
              <Link href={localizePath('/contact', locale)} className="ph-btn-secondary">
                {t('aboutPage.ctaContact')}
              </Link>
            </div>
          </article>
        </div>
      </PremiumShell>
    </>
  );
}
