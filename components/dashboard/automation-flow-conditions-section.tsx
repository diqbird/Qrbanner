'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { MAX_AUTOMATION_CONDITIONS } from '@/lib/automation-types';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';
import { AutomationFlowConditionRow } from './automation-flow-condition-row';

type AutomationFlowConditionsSectionProps = {
  builder: AutomationBuilderState;
};

export function AutomationFlowConditionsSection({ builder }: AutomationFlowConditionsSectionProps) {
  const { t, locale } = useLanguage();
  const { draft, addCondition } = builder;

  return (
    <div className="space-y-4 rounded-lg border border-border/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{t('settings.automations.if')}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCondition}
          disabled={draft.conditions.length >= MAX_AUTOMATION_CONDITIONS}
        >
          <Plus className="mr-1 h-3 w-3" /> {t('settings.automations.addCondition')}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('settings.automations.conditionQuota', {
          count: formatLocaleNumber(draft.conditions.length, locale),
          max: formatLocaleNumber(MAX_AUTOMATION_CONDITIONS, locale),
        })}
      </p>
      {draft.conditions.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t('settings.automations.noConditions')}</p>
      ) : (
        <div className="space-y-3">
          {draft.conditions.map((_, i) => (
            <AutomationFlowConditionRow key={i} builder={builder} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
