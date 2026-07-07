'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

export function AutomationFlowListToolbar({ builder }: { builder: AutomationBuilderState }) {
  const { t, locale } = useLanguage();
  const { flows, limit, openCreate } = builder;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">
        {t('settings.automations.count', {
          count: formatLocaleNumber(flows.length, locale),
          limit: formatLocaleNumber(limit, locale),
        })}
      </span>
      {flows.length < limit && (
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" /> {t('settings.automations.addBtn')}
        </Button>
      )}
    </div>
  );
}
