'use client';

import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { AUTOMATION_ACTION_TYPES, defaultAutomationAction } from '@/lib/automation-flow-utils';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';
import {
  AutomationFlowActionChatFields,
  AutomationFlowActionEmailFields,
  AutomationFlowActionWebhookFields,
} from './automation-flow-action-field-panels';

type AutomationFlowActionRowProps = {
  builder: AutomationBuilderState;
  index: number;
};

export function AutomationFlowActionRow({ builder, index }: AutomationFlowActionRowProps) {
  const { t } = useLanguage();
  const { draft, updateAction, removeAction } = builder;
  const action = draft.actions[index];

  const actionLabel = (type: string) => t(`settings.automations.actionType.${type}`);

  return (
    <div className="space-y-3 rounded-md border border-border/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <Select
          value={action.type}
          onValueChange={(v) =>
            updateAction(index, defaultAutomationAction(v as (typeof AUTOMATION_ACTION_TYPES)[number]))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AUTOMATION_ACTION_TYPES.map((at) => (
              <SelectItem key={at} value={at}>
                {actionLabel(at)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {draft.actions.length > 1 && (
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeAction(index)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>

      <AutomationFlowActionChatFields builder={builder} index={index} />
      <AutomationFlowActionEmailFields builder={builder} index={index} />
      <AutomationFlowActionWebhookFields builder={builder} index={index} />
    </div>
  );
}
