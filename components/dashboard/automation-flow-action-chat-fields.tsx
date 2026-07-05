'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

type AutomationFlowActionFieldsProps = {
  builder: AutomationBuilderState;
  index: number;
};

export function AutomationFlowActionChatFields({ builder, index }: AutomationFlowActionFieldsProps) {
  const { t } = useLanguage();
  const { draft, updateAction } = builder;
  const action = draft.actions[index];

  if (action.type !== 'slack' && action.type !== 'discord') return null;

  return (
    <>
      <div className="space-y-1">
        <Label className="text-xs">{t('settings.automations.webhookUrl')}</Label>
        <Input
          value={action.webhookUrl}
          onChange={(e) => updateAction(index, { ...action, webhookUrl: e.target.value })}
          placeholder="https://hooks.slack.com/..."
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('settings.automations.message')}</Label>
        <Textarea
          rows={3}
          value={action.message}
          onChange={(e) => updateAction(index, { ...action, message: e.target.value })}
        />
      </div>
    </>
  );
}
