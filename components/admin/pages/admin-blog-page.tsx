'use client';

import { AdminBlogPanel } from '@/components/admin/admin-blog-panel';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { useLanguage } from '@/components/i18n/language-provider';

export function AdminBlogPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.blog')} description={t('superAdmin.blog.desc')} />
      <AdminBlogPanel />
    </div>
  );
}
