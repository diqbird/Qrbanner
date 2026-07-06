'use client';

import { useLanguage } from '@/components/i18n/language-provider';

export function HeroProductPreview() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl animate-fade-up">
      <div className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="text-xs text-muted-foreground">qrbanner.com/dashboard</span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <div className="rounded-xl bg-primary/10 p-4">
          <p className="text-xs font-medium text-foreground/70">{t('landing.heroPreview.scansToday')}</p>
          <p className="font-display text-2xl font-bold text-primary">1,248</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground">{t('landing.heroPreview.activeQrCodes')}</p>
          <p className="font-display text-2xl font-bold">86</p>
        </div>
        <div className="col-span-full flex items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 py-8">
          <div className="text-center">
            <div
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-lg border-4 border-foreground bg-background shadow-inner"
              aria-hidden
            >
              <div className="grid grid-cols-3 gap-0.5 p-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-sm bg-foreground" />
                ))}
              </div>
            </div>
            <p className="text-sm font-medium">{t('landing.heroPreview.sampleQrName')}</p>
            <p className="text-xs text-muted-foreground">
              {t('landing.heroPreview.sampleQrMeta', { count: 342 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
