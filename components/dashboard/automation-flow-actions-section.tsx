'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { MAX_AUTOMATION_ACTIONS, TEMPLATE_VARS } from '@/lib/automation-types';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';
import { AutomationFlowActionRow } from './automation-flow-action-row';

type AutomationFlowActionsSectionProps = {
  builder: AutomationBuilderState;
};

export function AutomationFlowActionsSection({ builder }: AutomationFlowActionsSectionProps) {
  const { t } = useLanguage();
  const { draft, addAction } = builder;

  return (
    <div className="space-y-4 rounded-lg border border-border/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{t('settings.automations.then')}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAction}
          disabled={draft.actions.length >= MAX_AUTOMATION_ACTIONS}
        >
          <Plus className="mr-1 h-3 w-3" /> {t('settings.automations.addAction')}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('settings.automations.templateVars')}: {TEMPLATE_VARS.map((v) => `{{${v.key}}}`).join(', ')}
      </p>
      <div className="space-y-4">
        {draft.actions.map((_, i) => (
          <AutomationFlowActionRow key={i} builder={builder} index={i} />
        ))}
      </div>
    </div>
  );
}
