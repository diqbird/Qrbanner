'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationTrigger } from '@/lib/automation-types';
import { MAX_AUTOMATION_ACTIONS, MAX_AUTOMATION_CONDITIONS, TEMPLATE_VARS } from '@/lib/automation-types';
import {
  AUTOMATION_ACTION_TYPES,
  AUTOMATION_TRIGGERS,
  defaultAutomationAction,
} from '@/lib/automation-flow-utils';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

type AutomationFlowEditorDialogProps = {
  builder: AutomationBuilderState;
};

export function AutomationFlowEditorDialog({ builder }: AutomationFlowEditorDialogProps) {
  const { t } = useLanguage();
  const {
    dialogOpen,
    setDialogOpen,
    editingId,
    draft,
    setDraft,
    qrOptions,
    working,
    saveFlow,
    updateCondition,
    addCondition,
    removeCondition,
    updateAction,
    addAction,
    removeAction,
  } = builder;

  const triggerLabel = (trigger: AutomationTrigger) => t(`settings.automations.trigger.${trigger}`);
  const actionLabel = (type: string) => t(`settings.automations.actionType.${type}`);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingId ? t('settings.automations.editTitle') : t('settings.automations.createTitle')}
          </DialogTitle>
          <DialogDescription>{t('settings.automations.editorDesc')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label>{t('settings.automations.flowName')}</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              placeholder={t('settings.automations.flowNamePlaceholder')}
            />
          </div>

          <div className="space-y-4 rounded-lg border border-border/50 p-4">
            <p className="text-sm font-semibold">{t('settings.automations.when')}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('settings.automations.triggerLabel')}</Label>
                <Select
                  value={draft.trigger}
                  onValueChange={(v) => setDraft((p) => ({ ...p, trigger: v as AutomationTrigger }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUTOMATION_TRIGGERS.map((tr) => (
                      <SelectItem key={tr} value={tr}>
                        {triggerLabel(tr)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.automations.qrFilter')}</Label>
                <Select
                  value={draft.qrCodeId ?? '__all__'}
                  onValueChange={(v) =>
                    setDraft((p) => ({ ...p, qrCodeId: v === '__all__' ? null : v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{t('settings.automations.allQr')}</SelectItem>
                    {qrOptions.map((qr) => (
                      <SelectItem key={qr.id} value={qr.id}>
                        {qr.name} ({qr.shortCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border/50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{t('settings.automations.if')}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCondition}
                disabled={draft.conditions.length >= MAX_AUTOMATION_CONDITIONS}
              >
                <Plus className="mr-1 h-3 w-3" /> {t('settings.automations.addCondition')}
              </Button>
            </div>
            {draft.conditions.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t('settings.automations.noConditions')}</p>
            ) : (
              <div className="space-y-3">
                {draft.conditions.map((cond, i) => (
                  <div key={i} className="flex flex-wrap items-end gap-2">
                    <div className="min-w-[120px] space-y-1">
                      <Label className="text-xs">{t('settings.automations.field')}</Label>
                      <Select
                        value={cond.type}
                        onValueChange={(v) => {
                          const type = v as 'country' | 'device';
                          updateCondition(
                            i,
                            type === 'device'
                              ? { type: 'device', op: 'eq', value: cond.value }
                              : {
                                  type: 'country',
                                  op: cond.type === 'country' ? cond.op : 'eq',
                                  value: cond.value,
                                },
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="country">{t('settings.automations.fieldCountry')}</SelectItem>
                          <SelectItem value="device">{t('settings.automations.fieldDevice')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {cond.type === 'country' && (
                      <div className="min-w-[100px] space-y-1">
                        <Label className="text-xs">{t('settings.automations.operator')}</Label>
                        <Select
                          value={cond.op}
                          onValueChange={(v) =>
                            updateCondition(i, { type: 'country', op: v as 'eq' | 'neq', value: cond.value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eq">{t('settings.automations.opEq')}</SelectItem>
                            <SelectItem value="neq">{t('settings.automations.opNeq')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="min-w-[140px] flex-1 space-y-1">
                      <Label className="text-xs">{t('settings.automations.value')}</Label>
                      <Input
                        value={cond.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateCondition(
                            i,
                            cond.type === 'device'
                              ? { type: 'device', op: 'eq', value }
                              : { type: 'country', op: cond.op, value },
                          );
                        }}
                        placeholder={
                          cond.type === 'country'
                            ? t('settings.automations.countryPlaceholder')
                            : t('settings.automations.devicePlaceholder')
                        }
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeCondition(i)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              {t('settings.automations.templateVars')}:{' '}
              {TEMPLATE_VARS.map((v) => `{{${v.key}}}`).join(', ')}
            </p>
            <div className="space-y-4">
              {draft.actions.map((action, i) => (
                <div key={i} className="space-y-3 rounded-md border border-border/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Select
                      value={action.type}
                      onValueChange={(v) =>
                        updateAction(i, defaultAutomationAction(v as (typeof AUTOMATION_ACTION_TYPES)[number]))
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
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeAction(i)}>
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
                          onChange={(e) => updateAction(i, { ...action, webhookUrl: e.target.value })}
                          placeholder="https://hooks.slack.com/..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t('settings.automations.message')}</Label>
                        <Textarea
                          rows={3}
                          value={action.message}
                          onChange={(e) => updateAction(i, { ...action, message: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {action.type === 'email' && (
                    <>
                      <div className="space-y-1">
                        <Label className="text-xs">{t('common.email')}</Label>
                        <Input
                          value={action.to}
                          onChange={(e) => updateAction(i, { ...action, to: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t('settings.automations.subject')}</Label>
                        <Input
                          value={action.subject}
                          onChange={(e) => updateAction(i, { ...action, subject: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t('settings.automations.body')}</Label>
                        <Textarea
                          rows={4}
                          value={action.body}
                          onChange={(e) => updateAction(i, { ...action, body: e.target.value })}
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
                          onChange={(e) => updateAction(i, { ...action, url: e.target.value })}
                          placeholder="https://hooks.zapier.com/..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t('settings.automations.bodyOptional')}</Label>
                        <Textarea
                          rows={4}
                          value={action.body ?? ''}
                          onChange={(e) =>
                            updateAction(i, { ...action, body: e.target.value || undefined })
                          }
                          placeholder={t('settings.automations.webhookBodyPlaceholder')}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={saveFlow} loading={working}>
            {editingId ? t('common.save') : t('settings.automations.createBtn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
