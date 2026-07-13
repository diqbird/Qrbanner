'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import {
  formatResellerClientMonthlyFee,
  resolveResellerClientPlanLabel,
  resolveResellerClientStatusLabel,
} from '@/lib/i18n/resolve-reseller-client-labels';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

type EnterpriseResellerClientListProps = {
  enterprise: EnterpriseWorkspaceState;
};

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function EnterpriseResellerClientList({ enterprise }: EnterpriseResellerClientListProps) {
  const { t, clients, removeClient } = enterprise;
  const { locale } = useLanguage();

  if (clients.length === 0) return null;

  const exportCsv = () => {
    const header = ['name', 'email', 'plan', 'monthly_fee_usd', 'status'];
    const rows = clients.map((c) =>
      [
        csvEscape(c.name),
        csvEscape(c.email ?? ''),
        csvEscape(c.plan),
        ((c.monthlyFeeCents ?? 0) / 100).toFixed(2),
        csvEscape(c.status),
      ].join(','),
    );
    const blob = new Blob([[header.join(','), ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrbanner-reseller-clients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          {t('enterpriseWorkspace.exportClientsCsv')}
        </Button>
      </div>
      {clients.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
        >
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.email ?? t('common.emptyValue')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{resolveResellerClientPlanLabel(t, c.plan)}</Badge>
            <Badge variant="outline">{formatResellerClientMonthlyFee(c.monthlyFeeCents, locale, t)}</Badge>
            <Badge variant={c.status === 'active' ? 'default' : 'outline'}>
              {resolveResellerClientStatusLabel(t, c.status)}
            </Badge>
            <Button variant="ghost" size="icon-sm" onClick={() => removeClient(c.id)} aria-label={t('common.removeAria')}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
