'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Pencil, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationAction, AutomationCondition, AutomationTrigger } from '@/lib/automation-types';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

type AutomationFlowListProps = {
  builder: AutomationBuilderState;
};

export function AutomationFlowList({ builder }: AutomationFlowListProps) {
  const { t } = useLanguage();
  const {
    flows,
    qrOptions,
    limit,
    loading,
    openCreate,
    openEdit,
    toggleEnabled,
    removeFlow,
  } = builder;

  const triggerLabel = (trigger: AutomationTrigger) => t(`settings.automations.trigger.${trigger}`);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {t('settings.automations.count', { count: flows.length, limit })}
        </span>
        {flows.length < limit && (
          <Button size="sm" className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t('settings.automations.addBtn')}
          </Button>
        )}
      </div>

      {flows.length > 0 && (
        <div className="space-y-3">
          {flows.map((flow) => (
            <div key={flow.id} className="space-y-2 rounded-lg border border-border/50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{flow.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {triggerLabel(flow.trigger)}
                    {flow.qrCodeId
                      ? ` · ${qrOptions.find((q) => q.id === flow.qrCodeId)?.name ?? flow.qrCodeId}`
                      : ` · ${t('settings.automations.allQr')}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={flow.enabled ? 'default' : 'secondary'}>
                    {flow.enabled ? t('settings.automations.active') : t('settings.automations.paused')}
                  </Badge>
                  <Switch checked={flow.enabled} onCheckedChange={(v) => toggleEnabled(flow.id, v)} />
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(flow)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeFlow(flow.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{t('settings.automations.when')}</Badge>
                <span>{triggerLabel(flow.trigger)}</span>
                <ArrowRight className="h-3 w-3" />
                <Badge variant="outline">{t('settings.automations.if')}</Badge>
                <span>
                  {(flow.conditions as AutomationCondition[])?.length
                    ? t('settings.automations.conditionsCount', {
                        count: (flow.conditions as AutomationCondition[]).length,
                      })
                    : t('settings.automations.always')}
                </span>
                <ArrowRight className="h-3 w-3" />
                <Badge variant="outline">{t('settings.automations.then')}</Badge>
                <span>
                  {t('settings.automations.actionsCount', {
                    count: (flow.actions as AutomationAction[])?.length ?? 0,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {flows.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('settings.automations.empty')}</p>
      )}
    </>
  );
}
