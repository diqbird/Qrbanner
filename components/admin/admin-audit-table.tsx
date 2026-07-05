'use client';

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
import { ADMIN_AUDIT_PAGE_SIZE } from '@/lib/admin-audit-types';
import type { AdminAuditState } from '@/hooks/use-admin-audit';

export function AdminAuditTable({ audit }: { audit: AdminAuditState }) {
  const { t, entries, total, offset, loading, fetchLogs, actionLabel, hasMore } = audit;

  if (loading && entries.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">{t('admin.audit.empty')}</p>;
  }

  return (
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
            onClick={() => fetchLogs(offset + ADMIN_AUDIT_PAGE_SIZE, true)}
          >
            {loading ? t('common.loading') : t('admin.audit.loadMore')}
          </Button>
        </div>
      )}
    </>
  );
}
