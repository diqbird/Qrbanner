'use client';

import { AdminSiteSettings } from '@/components/admin/admin-site-settings';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { useLanguage } from '@/components/i18n/language-provider';

export function AdminSettingsPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.settings')} description={t('admin.siteSettingsSubtitle')} />
      <AdminSiteSettings />
    </div>
  );
}
