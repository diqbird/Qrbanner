'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Workflow, Plus, Trash2, Pencil, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import type {
  AutomationAction,
  AutomationCondition,
  AutomationFlowData,
  AutomationTrigger,
} from '@/lib/automation-types';
import {
  MAX_AUTOMATION_ACTIONS,
  MAX_AUTOMATION_CONDITIONS,
  TEMPLATE_VARS,
} from '@/lib/automation-types';

interface FlowRow extends AutomationFlowData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface LogRow {
  id: string;
  flowId: string;
  flowName: string;
  trigger: string;
  success: boolean;
  error: string | null;
  createdAt: string;
}

interface QrOption {
  id: string;
  name: string;
  shortCode: string;
}

const TRIGGERS: AutomationTrigger[] = ['scan', 'lead', 'cta_click'];
const ACTION_TYPES = ['slack', 'discord', 'email', 'webhook'] as const;

function defaultAction(type: (typeof ACTION_TYPES)[number] = 'slack'): AutomationAction {
  switch (type) {
    case 'discord':
      return { type: 'discord', webhookUrl: '', message: 'Event: {{qrName}} — {{country}}' };
    case 'email':
      return {
        type: 'email',
        to: '',
        subject: 'QRbanner: {{qrName}}',
        body: 'Trigger fired for {{shortCode}} from {{country}}.',
      };
    case 'webhook':
      return { type: 'webhook', url: '' };
    default:
      return { type: 'slack', webhookUrl: '', message: 'New event: {{qrName}} from {{country}}' };
  }
}

function emptyDraft(): AutomationFlowData {
  return {
    name: '',
    enabled: true,
    trigger: 'scan',
    qrCodeId: null,
    conditions: [],
    actions: [defaultAction()],
  };
}

function parseFlow(raw: FlowRow): AutomationFlowData {
  return {
    name: raw.name,
    enabled: raw.enabled,
    trigger: raw.trigger,
    qrCodeId: raw.qrCodeId ?? null,
    conditions: Array.isArray(raw.conditions) ? (raw.conditions as AutomationCondition[]) : [],
    actions: Array.isArray(raw.actions) ? (raw.actions as AutomationAction[]) : [defaultAction()],
  };
}

export function AutomationBuilder() {
  const { t } = useLanguage();
  const [flows, setFlows] = useState<FlowRow[]>([]);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [qrOptions, setQrOptions] = useState<QrOption[]>([]);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AutomationFlowData>(emptyDraft());

  const fetchFlows = useCallback(async () => {
    try {
      const res = await fetch('/api/automations');
      if (res.ok) {
        const data = await res.json();
        setFlows(data.flows ?? []);
        setLimit(data.limit ?? 3);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/automations/logs?limit=20');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const fetchQrOptions = useCallback(async () => {
    try {
      const res = await fetch('/api/qr?limit=200');
      if (res.ok) {
        const data = await res.json();
        const rows = (data.qrCodes ?? data.codes ?? []) as QrOption[];
        setQrOptions(rows.map((q) => ({ id: q.id, name: q.name, shortCode: q.shortCode })));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchFlows();
    fetchLogs();
    fetchQrOptions();
  }, [fetchFlows, fetchLogs, fetchQrOptions]);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setDialogOpen(true);
  };

  const openEdit = (flow: FlowRow) => {
    setEditingId(flow.id);
    setDraft(parseFlow(flow));
    setDialogOpen(true);
  };

  const saveFlow = async () => {
    if (!draft.name.trim()) return toast.error(t('settings.automations.nameRequired'));
    if (!draft.actions.length) return toast.error(t('settings.automations.actionRequired'));
    setWorking(true);
    try {
      const res = await fetch(editingId ? `/api/automations/${editingId}` : '/api/automations', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(resolveApiError(t, data.error, 'settings.automations.saveFailed'));
      }
      toast.success(editingId ? t('settings.automations.updated') : t('settings.automations.created'));
      setDialogOpen(false);
      fetchFlows();
      fetchLogs();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    const res = await fetch(`/api/automations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    if (res.ok) {
      setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, enabled } : f)));
    }
  };

  const removeFlow = async (id: string) => {
    if (!confirm(t('settings.automations.confirmDelete'))) return;
    const res = await fetch(`/api/automations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('settings.automations.removed'));
      fetchFlows();
      fetchLogs();
    } else {
      toast.error(t('settings.automations.removeFailed'));
    }
  };

  const updateCondition = (index: number, next: AutomationCondition) => {
    setDraft((prev) => {
      const conditions = [...prev.conditions];
      conditions[index] = next;
      return { ...prev, conditions };
    });
  };

  const addCondition = () => {
    if (draft.conditions.length >= MAX_AUTOMATION_CONDITIONS) return;
    setDraft((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { type: 'country', op: 'eq', value: '' }],
    }));
  };

  const removeCondition = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const updateAction = (index: number, action: AutomationAction) => {
    setDraft((prev) => {
      const actions = [...prev.actions];
      actions[index] = action;
      return { ...prev, actions };
    });
  };

  const addAction = () => {
    if (draft.actions.length >= MAX_AUTOMATION_ACTIONS) return;
    setDraft((prev) => ({ ...prev, actions: [...prev.actions, defaultAction()] }));
  };

  const removeAction = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };

  const triggerLabel = (trigger: AutomationTrigger) => t(`settings.automations.trigger.${trigger}`);
  const actionLabel = (type: string) => t(`settings.automations.actionType.${type}`);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" /> {t('settings.automations.title')}
          </CardTitle>
          <CardDescription>{t('settings.automations.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
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
                    <div
                      key={flow.id}
                      className="rounded-lg border border-border/50 p-3 space-y-2"
                    >
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
                            {flow.enabled
                              ? t('settings.automations.active')
                              : t('settings.automations.paused')}
                          </Badge>
                          <Switch
                            checked={flow.enabled}
                            onCheckedChange={(v) => toggleEnabled(flow.id, v)}
                          />
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
          )}

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
        </CardContent>
      </Card>

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

            <div className="rounded-lg border border-border/50 p-4 space-y-4">
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
                      {TRIGGERS.map((tr) => (
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

            <div className="rounded-lg border border-border/50 p-4 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{t('settings.automations.if')}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCondition}
                  disabled={draft.conditions.length >= MAX_AUTOMATION_CONDITIONS}
                >
                  <Plus className="h-3 w-3 mr-1" /> {t('settings.automations.addCondition')}
                </Button>
              </div>
              {draft.conditions.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('settings.automations.noConditions')}</p>
              ) : (
                <div className="space-y-3">
                  {draft.conditions.map((cond, i) => (
                    <div key={i} className="flex flex-wrap items-end gap-2">
                      <div className="space-y-1 min-w-[120px]">
                        <Label className="text-xs">{t('settings.automations.field')}</Label>
                        <Select
                          value={cond.type}
                          onValueChange={(v) => {
                            const type = v as 'country' | 'device';
                            updateCondition(
                              i,
                              type === 'device'
                                ? { type: 'device', op: 'eq', value: cond.value }
                                : { type: 'country', op: cond.type === 'country' ? cond.op : 'eq', value: cond.value }
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
                        <div className="space-y-1 min-w-[100px]">
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
                      <div className="space-y-1 flex-1 min-w-[140px]">
                        <Label className="text-xs">{t('settings.automations.value')}</Label>
                        <Input
                          value={cond.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            updateCondition(
                              i,
                              cond.type === 'device'
                                ? { type: 'device', op: 'eq', value }
                                : { type: 'country', op: cond.op, value }
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

            <div className="rounded-lg border border-border/50 p-4 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{t('settings.automations.then')}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAction}
                  disabled={draft.actions.length >= MAX_AUTOMATION_ACTIONS}
                >
                  <Plus className="h-3 w-3 mr-1" /> {t('settings.automations.addAction')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('settings.automations.templateVars')}:{' '}
                {TEMPLATE_VARS.map((v) => `{{${v.key}}}`).join(', ')}
              </p>
              <div className="space-y-4">
                {draft.actions.map((action, i) => (
                  <div key={i} className="rounded-md border border-border/40 p-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Select
                        value={action.type}
                        onValueChange={(v) => updateAction(i, defaultAction(v as (typeof ACTION_TYPES)[number]))}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ACTION_TYPES.map((at) => (
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
                            onChange={(e) =>
                              updateAction(i, { ...action, webhookUrl: e.target.value })
                            }
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
    </>
  );
}
