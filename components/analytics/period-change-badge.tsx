'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';

export function PeriodChangeBadge({
  changePct,
  className,
}: {
  changePct: number | null | undefined;
  className?: string;
}) {
  const { t, locale } = useLanguage();
  if (changePct === null || changePct === undefined) return null;

  const up = changePct >= 0;
  const formatted = formatLocaleNumber(Math.abs(changePct), locale);
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[10px] font-mono font-normal',
        up ? 'border-green-500/30 text-green-600 dark:text-green-400' : 'border-orange-500/30 text-orange-600 dark:text-orange-400',
        className,
      )}
    >
      {up ? t('analytics.changeUp', { n: formatted }) : t('analytics.changeDown', { n: formatted })}
    </Badge>
  );
}
