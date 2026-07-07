'use client';

import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { useOnboardingChecklist } from '@/hooks/use-onboarding-checklist';
import { OnboardingChecklistItemRow } from './onboarding-checklist-item-row';

export function OnboardingChecklist({ qrCount }: { qrCount: number }) {
  const { t, locale } = useLanguage();
  const { visible, checked, dismiss, toggle, doneCount, items } = useOnboardingChecklist(qrCount);

  if (!visible) return null;

  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display font-semibold">{t('onboarding.checklistTitle')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('onboarding.checklistSubtitle')}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('onboarding.checklistProgress', {
                done: formatLocaleNumber(doneCount, locale),
                total: formatLocaleNumber(items.length, locale),
              })}
            </p>
          </div>
          <button type="button" onClick={dismiss} className="text-muted-foreground hover:text-foreground" aria-label={t('common.dismissAria')}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <OnboardingChecklistItemRow
              key={item.key}
              item={item}
              isDone={Boolean(checked[item.key])}
              onToggle={() => toggle(item.key)}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
