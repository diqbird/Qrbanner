'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Webhook, Plus, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

interface WebhookRow {
  id: string;
  url: string;
  label: string | null;
  enabled: boolean;
  createdAt: string;
}

interface DeliveryRow {
  id: string;
  endpointId: string;
  endpointUrl: string | null;
  endpointLabel: string | null;
  event: string;
  statusCode: number | null;
  success: boolean;
  error: string | null;
  durationMs: number | null;
  createdAt: string;
}

export function WebhookSettings() {
  const { t } = useLanguage();
  const [webhooks, setWebhooks] = useState<WebhookRow[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);
  const [limit, setLimit] = useState(2);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [working, setWorking] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [showSecretDialog, setShowSecretDialog] = useState(false);

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await fetch('/api/webhooks/deliveries?limit=20');
      if (res.ok) {
        const data = await res.json();
        setDeliveries(data.deliveries ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const fetchWebhooks = useCallback(async () => {
    try {
      const res = await fetch('/api/webhooks');
      if (res.ok) {
        const data = await res.json();
        setWebhooks(data.webhooks ?? []);
        setLimit(data.limit ?? 2);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebhooks();
    fetchDeliveries();
  }, [fetchWebhooks, fetchDeliveries]);

  const addWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return toast.error(t('settings.webhooks.urlRequired'));
    setWorking(true);
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), label: label.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'settings.webhooks.addFailed'));
      setNewSecret(data.secret);
      setShowSecretDialog(true);
      setUrl('');
      setLabel('');
      fetchWebhooks();
      fetchDeliveries();
      toast.success(t('settings.webhooks.added'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    const res = await fetch(`/api/webhooks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    if (res.ok) {
      setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, enabled } : w)));
    }
  };

  const removeWebhook = async (id: string) => {
    if (!confirm(t('settings.webhooks.confirmDelete'))) return;
    const res = await fetch(`/api/webhooks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(t('settings.webhooks.removed'));
      fetchWebhooks();
    } else {
      toast.error(t('settings.webhooks.removeFailed'));
    }
  };

  const copySecret = () => {
    if (newSecret) {
      navigator.clipboard?.writeText(newSecret);
      toast.success(t('settings.webhooks.secretCopied'));
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" /> {t('settings.webhooks.title')}
          </CardTitle>
          <CardDescription>{t('settings.webhooks.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{t('settings.webhooks.count', { count: webhooks.length, limit })}</span>
              </div>

              {webhooks.length > 0 && (
                <div className="space-y-3">
                  {webhooks.map((w) => (
                    <div
                      key={w.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        {w.label && <p className="text-sm font-medium">{w.label}</p>}
                        <p className="truncate font-mono text-xs text-muted-foreground">{w.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={w.enabled ? 'default' : 'secondary'}>
                          {w.enabled ? t('settings.webhooks.active') : t('settings.webhooks.paused')}
                        </Badge>
                        <Switch checked={w.enabled} onCheckedChange={(v) => toggleEnabled(w.id, v)} />
                        <Button variant="ghost" size="icon-sm" onClick={() => removeWebhook(w.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {webhooks.length < limit && (
                <form onSubmit={addWebhook} className="space-y-3 border-t border-border/50 pt-4">
                  <div className="space-y-2">
                    <Label>{t('settings.webhooks.endpointUrl')}</Label>
                    <Input
                      placeholder={t('settings.webhooks.endpointPlaceholder')}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.webhooks.labelOptional')}</Label>
                    <Input
                      placeholder={t('settings.webhooks.labelPlaceholder')}
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                    />
                  </div>
                  <Button type="submit" loading={working} className="gap-2">
                    <Plus className="h-4 w-4" /> {t('settings.webhooks.addBtn')}
                  </Button>
                </form>
              )}
            </>
          )}

          <div className="space-y-3 border-t border-border/50 pt-4">
            <div>
              <p className="text-sm font-medium">{t('settings.webhooks.deliveriesTitle')}</p>
              <p className="text-xs text-muted-foreground">{t('settings.webhooks.deliveriesDesc')}</p>
            </div>
            {deliveries.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('settings.webhooks.deliveriesEmpty')}</p>
            ) : (
              <div className="space-y-2">
                {deliveries.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {d.endpointLabel ?? d.endpointUrl ?? d.endpointId}
                      </p>
                      <p className="text-muted-foreground">
                        {d.event} · {new Date(d.createdAt).toLocaleString()}
                        {d.durationMs != null ? ` · ${t('settings.webhooks.deliveryDuration', { ms: d.durationMs })}` : ''}
                      </p>
                      {d.error && <p className="text-destructive">{d.error}</p>}
                    </div>
                    <Badge variant={d.success ? 'default' : 'destructive'}>
                      {d.success
                        ? `${t('settings.webhooks.deliverySuccess')}${d.statusCode ? ` ${d.statusCode}` : ''}`
                        : t('settings.webhooks.deliveryFailed')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.webhooks.secretTitle')}</DialogTitle>
            <DialogDescription>{t('settings.webhooks.secretDesc')}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-3 font-mono text-xs break-all">{newSecret}</div>
          <DialogFooter>
            <Button variant="outline" onClick={copySecret} className="gap-2">
              <Copy className="h-4 w-4" /> {t('settings.webhooks.copySecret')}
            </Button>
            <Button onClick={() => setShowSecretDialog(false)}>{t('settings.webhooks.done')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
