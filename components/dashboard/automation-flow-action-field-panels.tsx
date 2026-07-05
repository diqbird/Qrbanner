'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

type AutomationFlowActionChatFieldsProps = {
  builder: AutomationBuilderState;
  index: number;
};

export function AutomationFlowActionChatFields({ builder, index }: AutomationFlowActionChatFieldsProps) {
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

export function AutomationFlowActionEmailFields({ builder, index }: AutomationFlowActionChatFieldsProps) {
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

export function AutomationFlowActionWebhookFields({ builder, index }: AutomationFlowActionChatFieldsProps) {
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
          placeholder="https://hooks.zapier.com/..."
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
