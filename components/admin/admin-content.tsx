'use client';

import { Shield } from 'lucide-react';
import { AdminBillingPanel } from '@/components/admin/admin-billing-panel';
import { AdminBlogPanel } from '@/components/admin/admin-blog-panel';
import { AdminAuditPanel } from '@/components/admin/admin-audit-panel';
import { AdminSiteSettings } from '@/components/admin/admin-site-settings';
import { MediaLibraryCard } from '@/components/dashboard/media-library-card';
import { useAdminContent } from '@/hooks/use-admin-content';
import { AdminStatsCards } from './admin-stats-cards';
import { AdminUsersTable } from './admin-users-table';

export function AdminContent() {
  const admin = useAdminContent();
  const { t, stats, loading } = admin;

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> {t('admin.title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('admin.subtitle')}</p>
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
        {t('admin.launchBanner')}
      </div>

      <AdminStatsCards admin={admin} />

      {stats ? (
        <AdminBillingPanel
          planCounts={stats.planCounts}
          estimatedMrr={stats.estimatedMrr}
          paddleSubscribers={stats.paddleSubscribers}
        />
      ) : null}

      <AdminUsersTable admin={admin} />
      <AdminSiteSettings />
      <AdminAuditPanel />
      <AdminBlogPanel />
      <MediaLibraryCard />
    </div>
  );
}
