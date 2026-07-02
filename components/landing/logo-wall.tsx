import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import Link from 'next/link';

const INTEGRATIONS = [
  { name: 'Stripe', href: null },
  { name: 'Zapier', href: '/integrations/zapier' },
  { name: 'Google Analytics', href: null },
  { name: 'Meta Pixel', href: null },
] as const;

export async function LandingLogoWall() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="border-b border-border/40 bg-background py-10" aria-label={t('logoWall.sectionLabel')}>
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('logoWall.integrationsTitle')}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {INTEGRATIONS.map((item) => {
            const inner = (
              <span className="font-display text-lg font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground">
                {item.name}
              </span>
            );
            return item.href ? (
              <Link key={item.name} href={item.href}>
                {inner}
              </Link>
            ) : (
              <span key={item.name}>{inner}</span>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">{t('logoWall.disclaimer')}</p>
      </div>
    </section>
  );
}
