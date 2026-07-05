'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { AdminContentState } from '@/hooks/use-admin-content';

type AdminUsersTableToolbarProps = {
  admin: AdminContentState;
};

export function AdminUsersTableToolbar({ admin }: AdminUsersTableToolbarProps) {
  const { t, search, setSearch, planFilter, setPlanFilter, fetchData } = admin;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-2">
      <Input
        placeholder={t('admin.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select value={planFilter} onValueChange={setPlanFilter}>
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder={t('admin.allPlans')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('admin.allPlans')}</SelectItem>
          <SelectItem value="free">{t('admin.planFree')}</SelectItem>
          <SelectItem value="pro">{t('admin.planPro')}</SelectItem>
          <SelectItem value="business">{t('admin.planBusiness')}</SelectItem>
          <SelectItem value="agency">{t('admin.planAgency')}</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={() => fetchData()}>
        {t('admin.refresh')}
      </Button>
    </div>
  );
}
