import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { pageMetadata, webPageJsonLd } from '@/lib/seo';
import { PublicBreadcrumbs } from '@/components/seo/public-breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { Gift, Link2, Users, ArrowRight } from 'lucide-react';

const STEP_ICONS = [Link2, Users, Gift];
const STEP_KEYS = ['referralLanding.step1', 'referralLanding.step2', 'referralLanding.step3'] as const;
const FAQ_KEYS = [
  'referralLanding.faq1q',
  'referralLanding.faq1a',
  'referralLanding.faq2q',
  'referralLanding.faq2a',
  'referralLanding.faq3q',
  'referralLanding.faq3a',
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);
  return pageMetadata({
    title: t('referralLanding.metaTitle'),
    description: t('referralLanding.metaDescription'),
    path: '/referral',
    keywords: ['QRbanner referral', 'QR code referral program', 'invite friends QR'],
  });
}

export default async function ReferralLandingPage() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: t('referralLanding.title'),
          description: t('referralLanding.subtitle'),
          path: '/referral',
        })}
      />
      <PublicBreadcrumbs items={[{ label: t('referralLanding.title'), href: '/referral' }]} />
      <div className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <header className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Gift className="h-7 w-7 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('referralLanding.title')}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t('referralLanding.subtitle')}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2 rounded-full">
                  {t('referralLanding.ctaSignup')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/settings">
                <Button size="lg" variant="outline" className="rounded-full">
                  {t('referralLanding.ctaSettings')}
                </Button>
              </Link>
            </div>
          </header>

          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-center">{t('referralLanding.howTitle')}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {STEP_KEYS.map((key, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <div key={key} className="rounded-2xl border border-border/50 bg-card p-6 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(key)}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold">{t('referralLanding.rewardsTitle')}</h2>
            <ul className="mt-6 space-y-3">
              {([1, 3, 5, 10] as const).map((m) => (
                <li key={m} className="rounded-lg border border-border/50 bg-card px-4 py-3 text-sm text-muted-foreground">
                  {t(`referral.milestone${m}` as 'referral.milestone1')}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">{t('referral.rewardsNote')}</p>
          </section>

          <section className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-background p-8">
            <h2 className="font-display text-xl font-semibold">{t('referralLanding.agencyTitle')}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t('referralLanding.agencyDesc')}</p>
            <Link href="/affiliates" className="mt-4 inline-block">
              <Button variant="outline" className="gap-2">
                {t('referralLanding.agencyCta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold">{t('referralLanding.faqTitle')}</h2>
            <dl className="mt-6 space-y-6">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <dt className="font-medium">{t(FAQ_KEYS[i * 2])}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">{t(FAQ_KEYS[i * 2 + 1])}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
