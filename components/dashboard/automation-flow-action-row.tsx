'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { AUTOMATION_ACTION_TYPES, defaultAutomationAction } from '@/lib/automation-flow-utils';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

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

      {(action.type === 'slack' || action.type === 'discord') && (
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
      )}

      {action.type === 'email' && (
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
      )}

      {action.type === 'webhook' && (
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
      )}
    </div>
  );
}
