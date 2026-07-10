'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type LoginAuditEntry = {
  id: string;
  email: string;
  provider: string;
  outcome: string;
  reason: string | null;
  ipAddress: string | null;
  createdAt: string;
};

export function AdminSecurityPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<LoginAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login-audit?limit=40');
      if (!res.ok) return;
      const data = (await res.json()) as { entries: LoginAuditEntry[] };
      setEntries(data.entries ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.security')} description={t('superAdmin.security.desc')} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('superAdmin.security.mfa')}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t('superAdmin.security.mfaDesc')}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('superAdmin.security.rateLimit')}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t('superAdmin.security.rateLimitDesc')}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('superAdmin.security.loginLogs')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('superAdmin.security.loginLogsDesc')}</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('superAdmin.security.loginLogsEmpty')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">{t('superAdmin.security.colTime')}</th>
                    <th className="py-2 pr-3 font-medium">{t('superAdmin.security.colEmail')}</th>
                    <th className="py-2 pr-3 font-medium">{t('superAdmin.security.colProvider')}</th>
                    <th className="py-2 pr-3 font-medium">{t('superAdmin.security.colOutcome')}</th>
                    <th className="py-2 pr-3 font-medium">{t('superAdmin.security.colIp')}</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((row) => (
                    <tr key={row.id} className="border-b border-border/50">
                      <td className="py-2 pr-3 whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-3">{row.email}</td>
                      <td className="py-2 pr-3">{row.provider}</td>
                      <td className="py-2 pr-3">
                        <Badge variant={row.outcome === 'success' ? 'default' : 'destructive'}>{row.outcome}</Badge>
                        {row.reason ? (
                          <span className="ml-2 text-xs text-muted-foreground">{row.reason}</span>
                        ) : null}
                      </td>
                      <td className="py-2 pr-3 text-xs text-muted-foreground">{row.ipAddress ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('superAdmin.security.audit')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{t('superAdmin.security.auditDesc')}</CardContent>
      </Card>
    </div>
  );
}
