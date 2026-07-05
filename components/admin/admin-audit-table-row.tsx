'use client';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import type { AdminAuditState } from '@/hooks/use-admin-audit';

type AuditEntry = AdminAuditState['entries'][number];

export function AdminAuditTableRow({
  entry,
  actionLabel,
}: {
  entry: AuditEntry;
  actionLabel: (action: string) => string;
}) {
  return (
    <TableRow>
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
        {entry.ipAddress && <p className="text-muted-foreground">{entry.ipAddress}</p>}
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
  );
}
