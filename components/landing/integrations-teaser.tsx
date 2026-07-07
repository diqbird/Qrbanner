import Link from 'next/link';
import { ArrowRight, Code2, Webhook, Zap } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { marketingCountVars } from '@/lib/i18n/qr-type-count';
import { Button } from '@/components/ui/button';

const ITEMS = [
  { key: 'zapier', icon: Zap, href: '/integrations/zapier' },
  { key: 'api', icon: Code2, href: '/developers' },
  { key: 'webhooks', icon: Webhook, href: '/developers#webhooks' },
] as const;

export async function LandingIntegrationsTeaser() {
  const locale = await getServerLocale();
  const counts = marketingCountVars(locale);
  const t = (key: string) => translate(locale, key, counts);

  return (
    <section className="cv-auto py-14 sm:py-16" aria-labelledby="integrations-teaser">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6">
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-background p-8 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="integrations-teaser" className="font-display text-2xl font-bold sm:text-3xl">
              {t('integrationsTeaser.title')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('integrationsTeaser.subtitle')}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {ITEMS.map(({ key, icon: Icon, href }) => (
              <Link
                key={key}
                href={href}
                className="rounded-xl border border-border/40 bg-card/80 p-5 text-center transition-colors hover:border-primary/30"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg icon-well-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="font-display text-sm font-semibold">{t(`integrationsTeaser.${key}Title`)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t(`integrationsTeaser.${key}Desc`)}</p>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/integrations">
              <Button variant="outline" className="gap-2">
                {t('integrationsTeaser.cta')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
