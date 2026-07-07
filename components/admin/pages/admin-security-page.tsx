'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminSecurityPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.security')} description={t('superAdmin.security.desc')} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">{t('superAdmin.security.mfa')}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{t('superAdmin.security.mfaDesc')}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">{t('superAdmin.security.rateLimit')}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{t('superAdmin.security.rateLimitDesc')}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">{t('superAdmin.security.loginLogs')}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{t('superAdmin.security.loginLogsDesc')}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">{t('superAdmin.security.audit')}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{t('superAdmin.security.auditDesc')}</CardContent></Card>
      </div>
    </div>
  );
}
