'use client';

import { AdminUsersTable } from '@/components/admin/admin-users-table';
import { useAdminContent } from '@/hooks/use-admin-content';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';

export function AdminUsersPage() {
  const admin = useAdminContent();
  return (
    <div className="space-y-6">
      <AdminPageHeader title={admin.t('superAdmin.nav.users')} description={admin.t('superAdmin.users.desc')} />
      <AdminUsersTable admin={admin} />
    </div>
  );
}
