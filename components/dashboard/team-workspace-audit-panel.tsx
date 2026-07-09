'use client';

import { useQuery } from '@tanstack/react-query';
import { formatLocaleDateTime } from '@/lib/i18n/format-locale';
import { useLanguage } from '@/components/i18n/language-provider';

type AuditEntry = {
  id: string;
  action: string;
  actorName: string | null;
  actorEmail: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
};

type TeamWorkspaceAuditPanelProps = {
  workspaceId: string;
  canView: boolean;
};

function actionLabel(
  t: (key: string, vars?: Record<string, string | number>) => string,
  action: string,
): string {
  const key = `settings.team.auditActions.${action.replace(/\./g, '_')}`;
  const label = t(key);
  return label === key ? action : label;
}

export function TeamWorkspaceAuditPanel({ workspaceId, canView }: TeamWorkspaceAuditPanelProps) {
  const { t, locale } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ['workspace-audit', workspaceId],
    enabled: Boolean(workspaceId) && canView,
    queryFn: async () => {
      const res = await fetch(`/api/workspace/audit-log?workspaceId=${encodeURIComponent(workspaceId)}&limit=20`);
      if (!res.ok) throw new Error('audit');
      return res.json() as Promise<{ entries: AuditEntry[]; total: number }>;
    },
  });

  if (!canView || !workspaceId) return null;

  const entries: AuditEntry[] = data?.entries ?? [];

  return (
    <div className="space-y-2 border-t border-border/50 pt-4">
      <p className="text-sm font-medium">{t('settings.team.auditTitle')}</p>
      <p className="text-xs text-muted-foreground">{t('settings.team.auditDesc')}</p>
      {isLoading ? (
        <p className="text-xs text-muted-foreground">{t('common.loading')}</p>
      ) : entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t('settings.team.auditEmpty')}</p>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-0.5 rounded-lg border border-border/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{actionLabel(t, entry.action)}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.actorName || entry.actorEmail || t('settings.team.auditUnknownActor')}
                </p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">
                {formatLocaleDateTime(entry.createdAt, locale)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
