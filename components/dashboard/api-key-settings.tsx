'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Key, Copy, RefreshCw, Trash2, BookOpen, Terminal, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';
import { useSettingsResource } from '@/hooks/use-settings-resource';

const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'https://qrbanner.com';

interface ApiUsageState {
  perMinuteLimit: number;
  monthlyQuota: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  monthlyResetAt: number;
}

type ApiKeyStatus = {
  hasKey: boolean;
  prefix: string | null;
  createdAt: string | null;
  planName: string | null;
  usage: ApiUsageState | null;
};

function parseApiKeyStatus(json: unknown): ApiKeyStatus {
  const data = json as Record<string, unknown>;
  const usage = data.usage as Record<string, number> | undefined;
  return {
    hasKey: Boolean(data.has_key),
    prefix: (data.prefix as string | null) ?? null,
    createdAt: (data.created_at as string | null) ?? null,
    planName: (data.plan_name as string | null) ?? null,
    usage: usage
      ? {
          perMinuteLimit: usage.per_minute_limit,
          monthlyQuota: usage.monthly_quota,
          monthlyUsed: usage.monthly_used,
          monthlyRemaining: usage.monthly_remaining,
          monthlyResetAt: usage.monthly_reset_at,
        }
      : null,
  };
}

export function ApiKeySettings() {
  const { t } = useLanguage();
  const { data, loading, reload } = useSettingsResource({
    url: '/api/auth/api-key',
    parse: parseApiKeyStatus,
  });
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [working, setWorking] = useState(false);

  const hasKey = data?.hasKey ?? false;
  const prefix = data?.prefix ?? null;
  const createdAt = data?.createdAt ?? null;
  const planName = data?.planName ?? null;
  const usage = data?.usage ?? null;

  const generateKey = async () => {
    if (hasKey && !confirm(t('settings.apiKey.confirmRegenerate'))) return;
    setWorking(true);
    try {
      const res = await fetch('/api/auth/api-key', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, json.error, 'settings.apiKey.generateFailed'));
      setNewKey(json.api_key);
      setShowKeyDialog(true);
      reload();
      toast.success(t('settings.apiKey.generated'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const revokeKey = async () => {
    if (!confirm(t('settings.apiKey.confirmRevoke'))) return;
    setWorking(true);
    try {
      const res = await fetch('/api/auth/api-key', { method: 'DELETE' });
      if (!res.ok) return toast.error(t('settings.apiKey.revokeFailed'));
      toast.success(t('settings.apiKey.revoked'));
      reload();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const copyKey = () => {
    if (newKey) {
      navigator.clipboard?.writeText(newKey);
      toast.success(t('settings.apiKey.copied'));
    }
  };

  const copyCurl = () => {
    const curl = `curl -H "Authorization: Bearer YOUR_API_KEY" ${API_BASE}/api/v1/qr`;
    navigator.clipboard?.writeText(curl);
    toast.success(t('settings.apiKey.curlCopied'));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" /> {t('settings.apiKey.title')}
          </CardTitle>
          <CardDescription>{t('settings.apiKey.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                {hasKey ? (
                  <>
                    <Badge variant="default" className="gap-1">
                      <Key className="h-3 w-3" /> {t('settings.apiKey.active')}
                    </Badge>
                    <code className="rounded bg-muted px-2 py-1 text-xs">{prefix}</code>
                    {createdAt && (
                      <span className="text-xs text-muted-foreground">
                        {t('settings.apiKey.created', {
                          date: new Date(createdAt).toLocaleDateString(),
                        })}
                      </span>
                    )}
                  </>
                ) : (
                  <Badge variant="secondary">{t('settings.apiKey.noKey')}</Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={generateKey} disabled={working} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {hasKey ? t('settings.apiKey.regenerate') : t('settings.apiKey.generate')}
                </Button>
                {hasKey && (
                  <Button variant="outline" onClick={revokeKey} disabled={working} className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" /> {t('settings.apiKey.revoke')}
                  </Button>
                )}
              </div>

              {usage && (
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-primary" /> {t('settings.apiKey.usageTitle')}
                    </p>
                    {planName && <Badge variant="outline">{planName}</Badge>}
                  </div>
                  {(() => {
                    const pct = usage.monthlyQuota > 0
                      ? Math.min(100, Math.round((usage.monthlyUsed / usage.monthlyQuota) * 100))
                      : 0;
                    const near = pct >= 80;
                    return (
                      <>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${near ? 'bg-destructive' : 'bg-primary'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>
                            {t('settings.apiKey.usageMonthly', {
                              used: usage.monthlyUsed.toLocaleString(),
                              quota: usage.monthlyQuota.toLocaleString(),
                            })}
                          </span>
                          <span>
                            {t('settings.apiKey.usageRemaining', {
                              remaining: usage.monthlyRemaining.toLocaleString(),
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t('settings.apiKey.usagePerMinute', {
                            limit: usage.perMinuteLimit.toLocaleString(),
                          })}
                          {' · '}
                          {t('settings.apiKey.usageResets', {
                            date: new Date(usage.monthlyResetAt * 1000).toLocaleDateString(),
                          })}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> {t('settings.apiKey.quickRef')}
                </p>
                <div className="space-y-2 text-xs font-mono text-muted-foreground">
                  <p>
                    {t('settings.apiKey.baseUrl')}{' '}
                    <span className="text-foreground">{API_BASE}/api/v1</span>
                  </p>
                  <p>{t('settings.apiKey.authHeader')}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 text-xs">
                  <div className="rounded border bg-background p-2">
                    <p className="font-semibold text-foreground mb-1">GET /qr</p>
                    <p className="text-muted-foreground">{t('settings.apiKey.listQr')}</p>
                  </div>
                  <div className="rounded border bg-background p-2">
                    <p className="font-semibold text-foreground mb-1">POST /qr</p>
                    <p className="text-muted-foreground">{t('settings.apiKey.createQr')}</p>
                  </div>
                  <div className="rounded border bg-background p-2">
                    <p className="font-semibold text-foreground mb-1">PATCH /qr/:id</p>
                    <p className="text-muted-foreground">{t('settings.apiKey.updateQr')}</p>
                  </div>
                  <div className="rounded border bg-background p-2">
                    <p className="font-semibold text-foreground mb-1">GET /folders</p>
                    <p className="text-muted-foreground">{t('settings.apiKey.listFolders')}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={copyCurl} className="gap-2">
                  <Terminal className="h-3.5 w-3.5" /> {t('settings.apiKey.copyCurl')}
                </Button>
              </div>

              <details className="rounded-lg border p-4">
                <summary className="cursor-pointer text-sm font-medium">
                  {t('settings.apiKey.jsonExample')}
                </summary>
                <pre className="mt-3 overflow-x-auto rounded bg-muted p-3 text-xs">
{`POST ${API_BASE}/api/v1/qr
Authorization: Bearer qb_live_...

{
  "name": "Store Entrance",
  "category": "url",
  "url": "https://example.com",
  "labels": ["retail"],
  "folder_id": "optional-folder-id"
}`}
                </pre>
              </details>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.apiKey.dialogTitle')}</DialogTitle>
            <DialogDescription>{t('settings.apiKey.dialogDesc')}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input value={newKey ?? ''} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={copyKey}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowKeyDialog(false)}>{t('settings.apiKey.saved')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
