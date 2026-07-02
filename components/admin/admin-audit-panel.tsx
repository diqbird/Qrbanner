'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClipboardList, Download } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

const PAGE_SIZE = 50;

const ACTION_FILTERS = [
  'all',
  'user.plan_update',
  'user.role_update',
  'site_settings.update',
  'blog.create',
  'blog.update',
  'blog.delete',
] as const;

interface AuditEntry {
  id: string;
  actorId: string;
  actorEmail: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  summary: string | null;
  metadata: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function AdminAuditPanel() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async (nextOffset = 0, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(nextOffset),
      });
      if (actionFilter !== 'all') params.set('action', actionFilter);

      const res = await fetch(`/api/admin/audit-log?${params}`);
      if (res.ok) {
        const data = await res.json();
        const rows = (data.entries ?? []) as AuditEntry[];
        setEntries(append ? (prev) => [...prev, ...rows] : rows);
        setTotal(data.total ?? 0);
        setOffset(nextOffset);
      }
    } finally {
      setLoading(false);
    }
  }, [actionFilter]);

  useEffect(() => {
    fetchLogs(0, false);
  }, [fetchLogs]);

  const actionLabel = (action: string) => {
    const key = `admin.audit.actions.${action.replace(/\./g, '_')}`;
    const label = t(key);
    return label === key ? action : label;
  };

  const filterLabel = (action: string) => {
    if (action === 'all') return t('admin.audit.filterAll');
    return actionLabel(action);
  };

  const hasMore = entries.length < total;

  const exportCsv = () => {
    const header = [
      t('admin.audit.colTime'),
      t('admin.audit.colAction'),
      t('admin.audit.colActor'),
      t('admin.audit.colTarget'),
      t('admin.audit.colSummary'),
      'IP',
      'User-Agent',
    ];
    const rows = entries.map((entry) => [
      new Date(entry.createdAt).toISOString(),
      entry.action,
      entry.actorEmail ?? entry.actorId,
      entry.targetType && entry.targetId ? `${entry.targetType}:${entry.targetId}` : '',
      entry.summary ?? '',
      entry.ipAddress ?? '',
      entry.userAgent ?? '',
    ]);
    const csv = [header, ...rows].map((row) => row.map((c) => escapeCsv(String(c))).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrbanner-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const retentionNote = useMemo(() => t('admin.audit.retention'), [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <ClipboardList className="h-5 w-5" /> {t('admin.audit.title')}
        </CardTitle>
        <CardDescription>{t('admin.audit.subtitle')}</CardDescription>
        <p className="text-xs text-muted-foreground">{retentionNote}</p>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Select
            value={actionFilter}
            onValueChange={(value) => setActionFilter(value)}
          >
            <SelectTrigger className="h-8 w-[200px] text-xs">
              <SelectValue placeholder={t('admin.audit.filterAction')} />
            </SelectTrigger>
            <SelectContent>
              {ACTION_FILTERS.map((action) => (
                <SelectItem key={action} value={action} className="text-xs">
                  {filterLabel(action)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => fetchLogs(0, false)} disabled={loading}>
            {t('admin.refresh')}
          </Button>
          {entries.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={loading}>
              <Download className="h-3.5 w-3.5 mr-1" />
              {t('admin.audit.exportCsv')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading && entries.length === 0 ? (
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
                  <TableHead>{t('admin.audit.colTarget')}</TableHead>
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
                    <TableCell className="text-xs text-muted-foreground">
                      {entry.targetType && entry.targetId ? (
                        <span>
                          {entry.targetType}
                          <br />
                          <span className="font-mono text-[10px]">{entry.targetId.slice(0, 12)}</span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="text-xs max-w-md">
                      <p>{entry.summary ?? '—'}</p>
                      {entry.userAgent ? (
                        <p className="mt-1 text-[10px] text-muted-foreground truncate max-w-xs" title={entry.userAgent}>
                          {entry.userAgent}
                        </p>
                      ) : null}
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
            {hasMore && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => fetchLogs(offset + PAGE_SIZE, true)}
                >
                  {loading ? t('common.loading') : t('admin.audit.loadMore')}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
