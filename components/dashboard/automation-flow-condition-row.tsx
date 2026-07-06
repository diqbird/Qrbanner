'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';
import { AutomationFlowConditionTypeSelect } from './automation-flow-condition-type-select';

type AutomationFlowConditionRowProps = {
  builder: AutomationBuilderState;
  index: number;
};

export function AutomationFlowConditionRow({ builder, index }: AutomationFlowConditionRowProps) {
  const { t } = useLanguage();
  const { draft, updateCondition, removeCondition } = builder;
  const cond = draft.conditions[index];

  return (
    <div className="flex flex-wrap items-end gap-2">
      <AutomationFlowConditionTypeSelect builder={builder} index={index} />
      {cond.type === 'country' && (
        <div className="min-w-[100px] space-y-1">
          <Label className="text-xs">{t('settings.automations.operator')}</Label>
          <Select
            value={cond.op}
            onValueChange={(v) =>
              updateCondition(index, { type: 'country', op: v as 'eq' | 'neq', value: cond.value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eq">{t('settings.automations.opEq')}</SelectItem>
              <SelectItem value="neq">{t('settings.automations.opNeq')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="min-w-[140px] flex-1 space-y-1">
        <Label className="text-xs">{t('settings.automations.value')}</Label>
        <Input
          value={cond.value}
          onChange={(e) => {
            const value = e.target.value;
            updateCondition(
              index,
              cond.type === 'device'
                ? { type: 'device', op: 'eq', value }
                : { type: 'country', op: cond.op, value },
            );
          }}
          placeholder={
            cond.type === 'country'
              ? t('settings.automations.countryPlaceholder')
              : t('settings.automations.devicePlaceholder')
          }
        />
      </div>
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeCondition(index)} aria-label={t('common.removeAria')}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
