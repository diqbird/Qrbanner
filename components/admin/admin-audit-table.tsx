'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_AUDIT_PAGE_SIZE } from '@/lib/admin-audit-types';
import type { AdminAuditState } from '@/hooks/use-admin-audit';
import { AdminAuditTableRow } from './admin-audit-table-row';

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
            <AdminAuditTableRow key={entry.id} entry={entry} actionLabel={actionLabel} />
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
