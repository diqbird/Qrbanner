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

export function AutomationFlowActionEmailFields({ builder, index }: AutomationFlowActionFieldsProps) {
  const { t } = useLanguage();
  const { draft, updateAction } = builder;
  const action = draft.actions[index];

  if (action.type !== 'email') return null;

  return (
    <>
      <div className="space-y-1">
        <Label className="text-xs">{t('common.email')}</Label>
        <Input value={action.to} onChange={(e) => updateAction(index, { ...action, to: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('settings.automations.subject')}</Label>
        <Input
          value={action.subject}
          onChange={(e) => updateAction(index, { ...action, subject: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('settings.automations.body')}</Label>
        <Textarea
          rows={4}
          value={action.body}
          onChange={(e) => updateAction(index, { ...action, body: e.target.value })}
        />
      </div>
    </>
  );
}
