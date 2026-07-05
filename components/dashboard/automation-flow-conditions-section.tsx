'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { MAX_AUTOMATION_CONDITIONS } from '@/lib/automation-types';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

type AutomationFlowConditionsSectionProps = {
  builder: AutomationBuilderState;
};

export function AutomationFlowConditionsSection({ builder }: AutomationFlowConditionsSectionProps) {
  const { t } = useLanguage();
  const { draft, addCondition, updateCondition, removeCondition } = builder;

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
      {draft.conditions.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t('settings.automations.noConditions')}</p>
      ) : (
        <div className="space-y-3">
          {draft.conditions.map((cond, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2">
              <div className="min-w-[120px] space-y-1">
                <Label className="text-xs">{t('settings.automations.field')}</Label>
                <Select
                  value={cond.type}
                  onValueChange={(v) => {
                    const type = v as 'country' | 'device';
                    updateCondition(
                      i,
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
              {cond.type === 'country' && (
                <div className="min-w-[100px] space-y-1">
                  <Label className="text-xs">{t('settings.automations.operator')}</Label>
                  <Select
                    value={cond.op}
                    onValueChange={(v) =>
                      updateCondition(i, { type: 'country', op: v as 'eq' | 'neq', value: cond.value })
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
                      i,
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
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeCondition(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
