'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleDateTime } from '@/lib/i18n/format-locale';

type LoginHistoryEntry = {
  id: string;
  provider: string;
  outcome: string;
  reason: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export function LoginHistoryPanel() {
  const { t, locale } = useLanguage();
  const [entries, setEntries] = useState<LoginHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login-history?limit=20');
      if (!res.ok) return;
      const data = (await res.json()) as { entries: LoginHistoryEntry[] };
      setEntries(data.entries ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const outcomeLabel = (outcome: string) => {
    if (outcome === 'success') return t('settings.loginHistory.outcomeSuccess');
    if (outcome === 'blocked') return t('settings.loginHistory.outcomeBlocked');
    return t('settings.loginHistory.outcomeFailure');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> {t('settings.loginHistory.title')}
        </CardTitle>
        <CardDescription>{t('settings.loginHistory.desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('settings.loginHistory.empty')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">{t('settings.loginHistory.colTime')}</th>
                  <th className="py-2 pr-3 font-medium">{t('settings.loginHistory.colProvider')}</th>
                  <th className="py-2 pr-3 font-medium">{t('settings.loginHistory.colOutcome')}</th>
                  <th className="py-2 pr-3 font-medium">{t('settings.loginHistory.colIp')}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((row) => (
                  <tr key={row.id} className="border-b border-border/50">
                    <td className="py-2 pr-3 whitespace-nowrap text-xs text-muted-foreground">
                      {formatLocaleDateTime(row.created_at, locale)}
                    </td>
                    <td className="py-2 pr-3">{row.provider}</td>
                    <td className="py-2 pr-3">
                      <Badge variant={row.outcome === 'success' ? 'default' : 'destructive'}>
                        {outcomeLabel(row.outcome)}
                      </Badge>
                      {row.reason ? (
                        <span className="ml-2 text-xs text-muted-foreground">{row.reason}</span>
                      ) : null}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                      {row.ip_address ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
