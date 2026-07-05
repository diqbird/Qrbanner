'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';
import { AutomationFlowListToolbar } from './automation-flow-list-toolbar';
import { AutomationFlowListRow } from './automation-flow-list-row';

type AutomationFlowListProps = {
  builder: AutomationBuilderState;
};

export function AutomationFlowList({ builder }: AutomationFlowListProps) {
  const { t } = useLanguage();
  const { flows, qrOptions, loading, openEdit, toggleEnabled, removeFlow } = builder;

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AutomationFlowListToolbar builder={builder} />
      {flows.length > 0 && (
        <div className="space-y-3">
          {flows.map((flow) => (
            <AutomationFlowListRow
              key={flow.id}
              flow={flow}
              qrOptions={qrOptions}
              onToggleEnabled={toggleEnabled}
              onEdit={openEdit}
              onRemove={removeFlow}
            />
          ))}
        </div>
      )}
      {flows.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('settings.automations.empty')}</p>
      )}
    </>
  );
}
