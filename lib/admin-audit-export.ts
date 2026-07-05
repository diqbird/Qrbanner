import { escapeAuditCsv, type AuditEntry } from '@/lib/admin-audit-types';

export function exportAdminAuditCsv(entries: AuditEntry[], t: (key: string) => string) {
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
  const csv = [header, ...rows].map((row) => row.map((c) => escapeAuditCsv(String(c))).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qrbanner-audit-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function adminAuditActionLabel(t: (key: string) => string, action: string) {
  const key = `admin.audit.actions.${action.replace(/\./g, '_')}`;
  const label = t(key);
  return label === key ? action : label;
}

export function adminAuditFilterLabel(t: (key: string) => string, action: string) {
  if (action === 'all') return t('admin.audit.filterAll');
  return adminAuditActionLabel(t, action);
}
