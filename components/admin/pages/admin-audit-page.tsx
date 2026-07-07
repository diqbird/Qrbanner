'use client';

import { AdminAuditPanel } from '@/components/admin/admin-audit-panel';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { useLanguage } from '@/components/i18n/language-provider';

export function AdminAuditPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.audit')} description={t('admin.audit.subtitle')} />
      <AdminAuditPanel />
    </div>
  );
}
