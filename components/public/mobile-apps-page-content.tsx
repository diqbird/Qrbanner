'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Code2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

const ROADMAP = [
  { key: 'roadmapPwa', status: 'available' as const },
  { key: 'roadmapApi', status: 'available' as const },
  { key: 'roadmapDeepLink', status: 'available' as const },
  { key: 'roadmapNative', status: 'planned' as const },
];

export function MobileAppsPageContent() {
  const { t } = useLanguage();

  return (
    <>
      <header className="text-center max-w-2xl mx-auto">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Smartphone className="h-6 w-6 text-primary" aria-hidden />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
          {t('mobileApps.title')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('mobileApps.subtitle')}</p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Monitor className="h-6 w-6 text-primary" />
            <Badge variant="secondary">{t('mobileApps.nativeStatusAvailable')}</Badge>
          </div>
          <h2 className="font-display text-lg font-semibold">{t('mobileApps.pwaTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('mobileApps.pwaDesc')}</p>
          <Link href="/dashboard">
            <Button className="gap-2 rounded-full">
              {t('mobileApps.openDashboard')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <Badge variant="secondary">{t('mobileApps.nativeStatusAvailable')}</Badge>
          </div>
          <h2 className="font-display text-lg font-semibold">{t('mobileApps.apiTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('mobileApps.apiDesc')}</p>
          <ul className="text-xs text-muted-foreground space-y-1 font-mono">
            <li>GET /api/mobile/v1/summary</li>
            <li>GET /api/mobile/v1/qr</li>
            <li>GET /api/mobile/v1/qr/:id</li>
          </ul>
          <Link href="/developers">
            <Button variant="outline" className="gap-2 rounded-full">
              {t('mobileApps.apiDocs')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">{t('mobileApps.roadmapTitle')}</h2>
        <ul className="mt-4 space-y-3">
          {ROADMAP.map((item) => (
            <li key={item.key} className="flex items-start justify-between gap-4 text-sm">
              <span className="text-muted-foreground">{t(`mobileApps.${item.key}`)}</span>
              <Badge variant={item.status === 'available' ? 'secondary' : 'outline'}>
                {item.status === 'available'
                  ? t('mobileApps.nativeStatusAvailable')
                  : t('mobileApps.nativeStatusPlanned')}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">{t('mobileApps.roadmapNote')}</p>
      </section>

      <div className="mt-8 rounded-2xl border border-dashed border-border/60 p-6">
        <p className="text-sm font-medium">{t('mobileApps.nativeTitle')}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t('mobileApps.nativeDesc')}</p>
      </div>
    </>
  );
}
