import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { PremiumShell } from '@/components/landing/premium/primitives';
import { SUPPORT_EMAIL, PRIVACY_EMAIL, supportMailto, whatsappUrl, demoBookingUrl } from '@/lib/site-contact';
import { SalesInquiryForm } from '@/components/marketing/sales-inquiry-form';
import Link from 'next/link';
import { Mail, MessageCircle, Calendar } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { localizePath, translate } from '@/lib/i18n';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    locale,
    title: t('contactPage.metaTitle'),
    description: t('contactPage.metaDescription'),
    path: '/contact',
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { demo?: string };
}) {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  const wa = whatsappUrl();
  const isDemo = searchParams?.demo === '1';

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('contactPage.title'),
          description: t('contactPage.subtitle'),
          path: '/contact',
          locale,
        })}
      />
      <PremiumShell>
        <div className="ph-container pb-16 pt-6 sm:pb-24 sm:pt-8">
          <div className="mx-auto max-w-3xl">
          <PublicBreadcrumbs items={[{ label: t('footer.contact'), href: '/contact' }]} />
          <header className="relative">
            <div className="pointer-events-none absolute -left-10 -top-8 -z-10 h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" aria-hidden />
            <p className="ph-eyebrow mb-4">{t('footer.contact')}</p>
            <h1 className="ph-title text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              {isDemo ? t('contactPage.demoTitle') : t('contactPage.title')}
            </h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {isDemo ? t('contactPage.demoSubtitle') : t('contactPage.subtitle')}
            </p>
          </header>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={supportMailto(isDemo ? 'QRbanner Demo Request' : 'QRbanner Support')}
              className="ph-card flex gap-4 p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium">{t('contactPage.emailTitle')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{SUPPORT_EMAIL}</p>
              </div>
            </a>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="ph-card flex gap-4 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{t('contactPage.whatsappTitle')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('contactPage.whatsappDesc')}</p>
                </div>
              </a>
            ) : (
              <Link href={localizePath('/faq', locale)} className="ph-card flex gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:bg-sky-400/15 dark:text-sky-400">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{t('nav.faq')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('contactPage.faqDesc')}</p>
                </div>
              </Link>
            )}
            {isDemo && (
              <a
                href={demoBookingUrl()}
                className="ph-card flex gap-4 border-[#2563EB]/30 bg-[#2563EB]/5 p-5 hover:translate-y-0 hover:scale-100 dark:border-sky-400/30 dark:bg-sky-400/10 sm:col-span-2"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB]/15 text-[#2563EB] dark:bg-sky-400/20 dark:text-sky-400">
                  <Calendar className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{t('contactPage.calendarTitle')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('contactPage.calendarDesc')}</p>
                </div>
              </a>
            )}
          </div>

          <section
            className="ph-card mt-12 p-6 hover:translate-y-0 hover:scale-100 sm:p-8"
            aria-labelledby="contact-form-heading"
          >
            <h2 id="contact-form-heading" className="ph-title text-xl">
              {isDemo ? t('contactPage.formDemoTitle') : t('contactPage.formTitle')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('contactPage.formSubtitle')}</p>
            <div className="mt-6">
              <SalesInquiryForm type={isDemo ? 'demo' : 'general'} compact />
            </div>
          </section>

          <p className="mt-8 text-sm text-muted-foreground">
            {t('contactPage.enterpriseNote')}{' '}
            <Link href={localizePath('/enterprise', locale)} className="text-[#2563EB] hover:underline dark:text-sky-400">
              {t('contactPage.enterpriseLink')}
            </Link>
            {' · '}
            {t('contactPage.privacyNote')}{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} className="text-[#2563EB] hover:underline dark:text-sky-400">
              {PRIVACY_EMAIL}
            </a>
          </p>
          </div>
        </div>
      </PremiumShell>
    </>
  );
}
