export const ADMIN_AUDIT_PAGE_SIZE = 50;

export const ADMIN_AUDIT_ACTION_FILTERS = [
  'all',
  'user.plan_update',
  'user.role_update',
  'site_settings.update',
  'blog.create',
  'blog.update',
  'blog.delete',
] as const;

export interface AuditEntry {
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

export function escapeAuditCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
