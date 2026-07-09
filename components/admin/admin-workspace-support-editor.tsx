'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminQueryKeys } from '@/lib/admin/query-keys';

export type AdminWorkspaceRow = {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  ownerPlan: string;
  memberCount: number;
  qrCount: number;
  ssoEnabled: boolean;
  supportTier: string;
  assignedCsmName: string | null;
  assignedCsmEmail: string | null;
  slaUptimePercent: number | null;
  slaNotes: string | null;
  createdAt: string;
};

export function AdminWorkspaceSupportEditor({
  workspace,
  t,
}: {
  workspace: AdminWorkspaceRow;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [supportTier, setSupportTier] = useState(workspace.supportTier || 'standard');
  const [csmName, setCsmName] = useState(workspace.assignedCsmName ?? '');
  const [csmEmail, setCsmEmail] = useState(workspace.assignedCsmEmail ?? '');
  const [uptime, setUptime] = useState(
    workspace.slaUptimePercent != null ? String(workspace.slaUptimePercent) : '',
  );
  const [notes, setNotes] = useState(workspace.slaNotes ?? '');

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/workspaces/${workspace.id}/support`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supportTier,
          assignedCsmName: csmName.trim() || null,
          assignedCsmEmail: csmEmail.trim() || null,
          slaUptimePercent: uptime.trim() ? parseFloat(uptime) : null,
          slaNotes: notes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error('patch');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminQueryKeys.all, 'workspaces'] });
      toast.success(t('superAdmin.workspaces.supportSaved'));
      setOpen(false);
    },
    onError: () => toast.error(t('superAdmin.workspaces.supportFailed')),
  });

  if (!open) {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {workspace.supportTier !== 'standard' ? (
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            {t(`superAdmin.workspaces.tier.${workspace.supportTier}`)}
          </span>
        ) : null}
        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setOpen(true)}>
          {t('superAdmin.workspaces.editSupport')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
      <Select value={supportTier} onValueChange={setSupportTier}>
        <SelectTrigger className="h-8 w-full max-w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">{t('superAdmin.workspaces.tier.standard')}</SelectItem>
          <SelectItem value="priority">{t('superAdmin.workspaces.tier.priority')}</SelectItem>
          <SelectItem value="enterprise">{t('superAdmin.workspaces.tier.enterprise')}</SelectItem>
        </SelectContent>
      </Select>
      <Input
        className="h-8"
        placeholder={t('superAdmin.workspaces.csmName')}
        value={csmName}
        onChange={(e) => setCsmName(e.target.value)}
      />
      <Input
        className="h-8"
        type="email"
        placeholder={t('superAdmin.workspaces.csmEmail')}
        value={csmEmail}
        onChange={(e) => setCsmEmail(e.target.value)}
      />
      <Input
        className="h-8"
        placeholder={t('superAdmin.workspaces.uptime')}
        value={uptime}
        onChange={(e) => setUptime(e.target.value)}
      />
      <Input
        className="h-8"
        placeholder={t('superAdmin.workspaces.slaNotes')}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" loading={mutation.isPending} onClick={() => mutation.mutate()}>
          {t('common.save')}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          {t('common.cancel')}
        </Button>
      </div>
    </div>
  );
}
