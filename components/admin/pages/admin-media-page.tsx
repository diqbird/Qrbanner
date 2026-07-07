'use client';

import { MediaLibraryCard } from '@/components/dashboard/media-library-card';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { useLanguage } from '@/components/i18n/language-provider';

export function AdminMediaPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.media')} description={t('superAdmin.media.desc')} />
      <MediaLibraryCard />
    </div>
  );
}
