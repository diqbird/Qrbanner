'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClipboardList } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

interface AuditEntry {
  id: string;
  actorEmail: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  summary: string | null;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: string;
}

export function AdminAuditPanel() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-log?limit=50');
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const actionLabel = (action: string) => {
    const key = `admin.audit.actions.${action.replace(/\./g, '_')}`;
    const label = t(key);
    return label === key ? action : label;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <ClipboardList className="h-5 w-5" /> {t('admin.audit.title')}
        </CardTitle>
        <CardDescription>{t('admin.audit.subtitle')}</CardDescription>
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
            {t('admin.refresh')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">{t('admin.audit.empty')}</p>
        ) : (
          <>
            <p className="mb-3 text-xs text-muted-foreground">
              {t('admin.audit.showing', { count: entries.length, total })}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.audit.colTime')}</TableHead>
                  <TableHead>{t('admin.audit.colAction')}</TableHead>
                  <TableHead>{t('admin.audit.colActor')}</TableHead>
                  <TableHead>{t('admin.audit.colSummary')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {actionLabel(entry.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <p>{entry.actorEmail ?? entry.actorId.slice(0, 8)}</p>
                      {entry.ipAddress && (
                        <p className="text-muted-foreground">{entry.ipAddress}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-xs max-w-md">
                      <p>{entry.summary ?? '—'}</p>
                      {entry.metadata ? (
                        <pre className="mt-1 max-h-24 overflow-auto rounded bg-muted/50 p-2 text-[10px]">
                          {JSON.stringify(entry.metadata, null, 2)}
                        </pre>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
