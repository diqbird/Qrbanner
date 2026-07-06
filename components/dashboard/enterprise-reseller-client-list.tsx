'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

type EnterpriseResellerClientListProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseResellerClientList({ enterprise }: EnterpriseResellerClientListProps) {
  const { t, clients, removeClient } = enterprise;

  if (clients.length === 0) return null;

  return (
    <div className="space-y-2">
      {clients.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
        >
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.email ?? '—'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{c.plan}</Badge>
            <Badge variant="outline">${(c.monthlyFeeCents / 100).toFixed(2)}/mo</Badge>
            <Badge variant={c.status === 'active' ? 'default' : 'outline'}>{c.status}</Badge>
            <Button variant="ghost" size="icon-sm" onClick={() => removeClient(c.id)} aria-label={t('common.removeAria')}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
