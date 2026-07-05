'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { useLanguage } from '@/components/i18n/language-provider';

export function AnalyticsViewRetentionBanner({
  retentionCutoff,
  planName,
}: {
  retentionCutoff: string;
  planName: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2 text-sm">
      <span>
        {t('analytics.retentionBanner', {
          date: format(new Date(retentionCutoff), 'MMM d, yyyy'),
          plan: planName,
        })}
      </span>
      <Link href="/pricing" className="text-xs font-medium text-primary hover:underline">
        {t('analytics.retentionUpgrade')}
      </Link>
    </div>
  );
}
