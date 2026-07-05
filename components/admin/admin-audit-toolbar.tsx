'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download } from 'lucide-react';
import { ADMIN_AUDIT_ACTION_FILTERS } from '@/lib/admin-audit-types';
import type { AdminAuditState } from '@/hooks/use-admin-audit';

export function AdminAuditToolbar({ audit }: { audit: AdminAuditState }) {
  const { t, entries, actionFilter, setActionFilter, loading, fetchLogs, filterLabel, exportCsv } = audit;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <Select value={actionFilter} onValueChange={(value) => setActionFilter(value)}>
        <SelectTrigger className="h-8 w-[200px] text-xs">
          <SelectValue placeholder={t('admin.audit.filterAction')} />
        </SelectTrigger>
        <SelectContent>
          {ADMIN_AUDIT_ACTION_FILTERS.map((action) => (
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
  );
}
