'use client';

import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationTrigger } from '@/lib/automation-types';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

type AutomationLogsPanelProps = {
  builder: AutomationBuilderState;
};

export function AutomationLogsPanel({ builder }: AutomationLogsPanelProps) {
  const { t } = useLanguage();
  const { logs } = builder;

  const triggerLabel = (trigger: AutomationTrigger) => t(`settings.automations.trigger.${trigger}`);

  return (
    <div className="space-y-3 border-t border-border/50 pt-4">
      <div>
        <p className="text-sm font-medium">{t('settings.automations.logsTitle')}</p>
        <p className="text-xs text-muted-foreground">{t('settings.automations.logsDesc')}</p>
      </div>
      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('settings.automations.logsEmpty')}</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs"
            >
              <div className="min-w-0">
                <p className="font-medium">{log.flowName}</p>
                <p className="text-muted-foreground">
                  {triggerLabel(log.trigger as AutomationTrigger)} ·{' '}
                  {new Date(log.createdAt).toLocaleString()}
                </p>
                {log.error && <p className="text-destructive">{log.error}</p>}
              </div>
              <Badge variant={log.success ? 'default' : 'destructive'}>
                {log.success
                  ? t('settings.automations.logSuccess')
                  : t('settings.automations.logFailed')}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
