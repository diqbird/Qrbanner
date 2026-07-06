'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

type EnterpriseResellerClientFormProps = {
  enterprise: EnterpriseWorkspaceState;
};

export function EnterpriseResellerClientForm({ enterprise }: EnterpriseResellerClientFormProps) {
  const {
    t,
    working,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPlan,
    setClientPlan,
    clientFee,
    setClientFee,
    addClient,
  } = enterprise;

  return (
    <form onSubmit={addClient} className="grid gap-2 sm:grid-cols-2">
      <Input
        placeholder={t('enterpriseWorkspace.clientName')}
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />
      <Input
        type="email"
        placeholder={t('enterpriseWorkspace.clientEmail')}
        value={clientEmail}
        onChange={(e) => setClientEmail(e.target.value)}
      />
      <Select value={clientPlan} onValueChange={setClientPlan}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">{t('enterpriseWorkspace.planFree')}</SelectItem>
          <SelectItem value="pro">{t('enterpriseWorkspace.planPro')}</SelectItem>
          <SelectItem value="business">{t('enterpriseWorkspace.planBusiness')}</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder={t('enterpriseWorkspace.clientFee')}
        value={clientFee}
        onChange={(e) => setClientFee(e.target.value)}
      />
      <Button type="submit" className="gap-1 sm:col-span-2" loading={working}>
        <Plus className="h-4 w-4" /> {t('enterpriseWorkspace.addClient')}
      </Button>
    </form>
  );
}
