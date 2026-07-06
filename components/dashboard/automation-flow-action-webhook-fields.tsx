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

export function AutomationFlowActionWebhookFields({ builder, index }: AutomationFlowActionFieldsProps) {
  const { t } = useLanguage();
  const { draft, updateAction } = builder;
  const action = draft.actions[index];

  if (action.type !== 'webhook') return null;

  return (
    <>
      <div className="space-y-1">
        <Label className="text-xs">{t('settings.automations.webhookUrl')}</Label>
        <Input
          value={action.url}
          onChange={(e) => updateAction(index, { ...action, url: e.target.value })}
          placeholder={t('settings.webhooks.endpointPlaceholder')}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t('settings.automations.bodyOptional')}</Label>
        <Textarea
          rows={4}
          value={action.body ?? ''}
          onChange={(e) => updateAction(index, { ...action, body: e.target.value || undefined })}
          placeholder={t('settings.automations.webhookBodyPlaceholder')}
        />
      </div>
    </>
  );
}
