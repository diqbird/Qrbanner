'use client';

import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

export function AutomationFlowConditionTypeSelect({
  builder,
  index,
}: {
  builder: AutomationBuilderState;
  index: number;
}) {
  const { t } = useLanguage();
  const { draft, updateCondition } = builder;
  const cond = draft.conditions[index];

  return (
    <div className="min-w-[120px] space-y-1">
      <Label className="text-xs">{t('settings.automations.field')}</Label>
      <Select
        value={cond.type}
        onValueChange={(v) => {
          const type = v as 'country' | 'device';
          updateCondition(
            index,
            type === 'device'
              ? { type: 'device', op: 'eq', value: cond.value }
              : {
                  type: 'country',
                  op: cond.type === 'country' ? cond.op : 'eq',
                  value: cond.value,
                },
          );
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="country">{t('settings.automations.fieldCountry')}</SelectItem>
          <SelectItem value="device">{t('settings.automations.fieldDevice')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
