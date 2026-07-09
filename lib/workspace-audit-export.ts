import { escapeAuditCsv } from '@/lib/admin-audit-types';

export type WorkspaceAuditCsvEntry = {
  action: string;
  actorName: string | null;
  actorEmail: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
};

export function exportWorkspaceAuditCsv(
  entries: WorkspaceAuditCsvEntry[],
  t: (key: string) => string,
) {
  const header = [
    t('settings.team.auditColTime'),
    t('settings.team.auditColAction'),
    t('settings.team.auditColActor'),
    t('settings.team.auditColMeta'),
  ];
  const rows = entries.map((entry) => [
    new Date(entry.createdAt).toISOString(),
    entry.action,
    entry.actorEmail ?? entry.actorName ?? '',
    entry.meta ? JSON.stringify(entry.meta) : '',
  ]);
  const csv = [header, ...rows].map((row) => row.map((c) => escapeAuditCsv(String(c))).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workspace-audit-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
