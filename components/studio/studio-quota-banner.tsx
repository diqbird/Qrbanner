'use client';

import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';

export function StudioQuotaBanner({ remaining, max }: { remaining: number; max: number }) {
  const { t, locale } = useLanguage();

  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0">
        <p className="font-medium text-sm">{t('studio.quotaTitle')}</p>
        <p className="text-sm text-muted-foreground">
          {t('studio.quotaBody', {
            remaining: formatLocaleNumber(remaining, locale),
            max: formatLocaleNumber(max, locale),
          })}
        </p>
      </div>
    </div>
  );
}
