'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Globe, Plus, RefreshCw, Trash2, CheckCircle2, Copy, Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

interface CustomDomainRecord {
  id: string;
  domain: string;
  status: string;
  verifyToken: string;
  isPrimary: boolean;
  verifiedAt: string | null;
}

interface DnsInstructions {
  cname: { host: string; value: string };
  txt: { host: string; value: string };
}

export function CustomDomainSettings() {
  const { t } = useLanguage();
  const [domains, setDomains] = useState<CustomDomainRecord[]>([]);
  const [scanBaseUrl, setScanBaseUrl] = useState('https://qrbanner.com');
  const [cnameTarget, setCnameTarget] = useState('qrbanner.com');
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [pendingDns, setPendingDns] = useState<DnsInstructions | null>(null);

  const fetchDomains = useCallback(async () => {
    try {
      const res = await fetch('/api/domains');
      if (res.ok) {
        const data = await res.json();
        setDomains(data.domains ?? []);
        setScanBaseUrl(data.scan_base_url ?? 'https://qrbanner.com');
        setCnameTarget(data.cname_target ?? 'qrbanner.com');
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const addDomain = async () => {
    const domain = newDomain.trim();
    if (!domain) return toast.error(t('settings.customDomain.domainRequired'));
    setWorking(true);
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'settings.customDomain.addFailed'));
      toast.success(t('settings.customDomain.added'));
      setNewDomain('');
      setPendingDns(data.dns);
      fetchDomains();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const verifyDomain = async (id: string) => {
    setWorking(true);
    try {
      const res = await fetch(`/api/domains/${id}/verify`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) return toast.error(resolveApiError(t, data.error, 'settings.customDomain.verifyFailed'));
      toast.success(t('settings.customDomain.verified'));
      setPendingDns(null);
      fetchDomains();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setWorking(false);
    }
  };

  const setPrimary = async (id: string) => {
    try {
      const res = await fetch(`/api/domains/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_primary: true }),
      });
      if (!res.ok) return toast.error(t('settings.customDomain.primaryFailed'));
      toast.success(t('settings.customDomain.primaryUpdated'));
      fetchDomains();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const removeDomain = async (id: string, domain: string) => {
    if (!confirm(t('settings.customDomain.confirmRemove', { domain }))) return;
    try {
      const res = await fetch(`/api/domains/${id}`, { method: 'DELETE' });
      if (!res.ok) return toast.error(t('settings.customDomain.removeFailed'));
      toast.success(t('settings.customDomain.removed'));
      fetchDomains();
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(t('settings.customDomain.copied'));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" /> {t('settings.customDomain.title')}
        </CardTitle>
        <CardDescription>{t('settings.customDomain.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">{t('settings.customDomain.scanBase')}</p>
              <p className="font-mono text-sm font-medium mt-1">{scanBaseUrl}</p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder={t('settings.customDomain.placeholder')}
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDomain()}
              />
              <Button onClick={addDomain} disabled={working} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" /> {t('settings.customDomain.add')}
              </Button>
            </div>

            {(pendingDns || domains.some((d) => d.status !== 'verified')) && (
              <div className="rounded-lg border border-dashed p-4 space-y-3 text-sm">
                <p className="font-medium">{t('settings.customDomain.dnsTitle')}</p>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between gap-2 rounded bg-muted p-2">
                    <span>{t('settings.customDomain.cname', { target: cnameTarget })}</span>
                    <Button variant="ghost" size="sm" onClick={() => copy(cnameTarget)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {pendingDns && (
                    <div className="rounded bg-muted p-2 space-y-1">
                      <p>{t('settings.customDomain.txtHost', { host: pendingDns.txt.host })}</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="break-all">{pendingDns.txt.value}</span>
                        <Button variant="ghost" size="sm" onClick={() => copy(pendingDns.txt.value)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{t('settings.customDomain.dnsHint')}</p>
              </div>
            )}

            <div className="space-y-3">
              {domains.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('settings.customDomain.empty')}</p>
              ) : (
                domains.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{d.domain}</span>
                      {d.status === 'verified' ? (
                        <Badge className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {t('settings.customDomain.verifiedBadge')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{t('settings.customDomain.pending')}</Badge>
                      )}
                      {d.isPrimary && d.status === 'verified' && (
                        <Badge variant="outline" className="gap-1">
                          <Star className="h-3 w-3" /> {t('settings.customDomain.primary')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {d.status !== 'verified' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verifyDomain(d.id)}
                          disabled={working}
                          className="gap-1"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> {t('settings.customDomain.verifyDns')}
                        </Button>
                      )}
                      {d.status === 'verified' && !d.isPrimary && (
                        <Button size="sm" variant="outline" onClick={() => setPrimary(d.id)}>
                          {t('settings.customDomain.setPrimary')}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeDomain(d.id, d.domain)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
