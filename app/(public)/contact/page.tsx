import type { Metadata } from 'next';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { SUPPORT_EMAIL, PRIVACY_EMAIL, supportMailto, whatsappUrl, demoBookingUrl } from '@/lib/site-contact';
import { SalesInquiryForm } from '@/components/marketing/sales-inquiry-form';
import Link from 'next/link';
import { Mail, MessageCircle, Calendar } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';

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
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('footer.contact'), href: '/contact' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {isDemo ? t('contactPage.demoTitle') : t('contactPage.title')}
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {isDemo ? t('contactPage.demoSubtitle') : t('contactPage.subtitle')}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={supportMailto(isDemo ? 'QRbanner Demo Request' : 'QRbanner Support')}
              className="flex gap-4 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <Mail className="h-6 w-6 shrink-0 text-primary" />
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
                className="flex gap-4 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <MessageCircle className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{t('contactPage.whatsappTitle')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('contactPage.whatsappDesc')}</p>
                </div>
              </a>
            ) : (
              <Link
                href="/faq"
                className="flex gap-4 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <MessageCircle className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{t('nav.faq')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('contactPage.faqDesc')}</p>
                </div>
              </Link>
            )}
            {isDemo && (
              <a
                href={demoBookingUrl()}
                className="flex gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:col-span-2"
              >
                <Calendar className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{t('contactPage.calendarTitle')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('contactPage.calendarDesc')}</p>
                </div>
              </a>
            )}
          </div>

          <section className="mt-12 rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">
              {isDemo ? t('contactPage.formDemoTitle') : t('contactPage.formTitle')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{t('contactPage.formSubtitle')}</p>
            <div className="mt-6">
              <SalesInquiryForm type={isDemo ? 'demo' : 'general'} compact />
            </div>
          </section>

          <p className="mt-8 text-sm text-muted-foreground">
            {t('contactPage.enterpriseNote')}{' '}
            <Link href="/enterprise" className="text-primary hover:underline">
              {t('contactPage.enterpriseLink')}
            </Link>
            {' · '}
            {t('contactPage.privacyNote')}{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} className="text-primary hover:underline">
              {PRIVACY_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
