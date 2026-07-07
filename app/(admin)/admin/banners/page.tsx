'use client';
import { AdminModuleScaffold } from '@/components/admin/shared/admin-module-scaffold';
import { useLanguage } from '@/components/i18n/language-provider';
export default function Page() {
  const { t } = useLanguage();
  return <AdminModuleScaffold title={t('superAdmin.nav.banners')} description={t('superAdmin.banners.desc')} status="beta" />;
}
