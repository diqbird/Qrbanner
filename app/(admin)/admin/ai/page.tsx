'use client';
import { AdminModuleScaffold } from '@/components/admin/shared/admin-module-scaffold';
import { useLanguage } from '@/components/i18n/language-provider';
export default function Page() {
  const { t } = useLanguage();
  return <AdminModuleScaffold title={t('superAdmin.nav.ai')} description={t('superAdmin.ai.desc')} status="beta" />;
}
