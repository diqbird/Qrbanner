'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AdminRolesPage() {
  const { t } = useLanguage();
  const roles = [
    { id: 'admin', perms: t('superAdmin.roles.adminPerms') },
    { id: 'user', perms: t('superAdmin.roles.userPerms') },
  ];
  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.roles')} description={t('superAdmin.roles.desc')} />
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((r) => (
          <Card key={r.id}>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Badge>{r.id}</Badge></CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{r.perms}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
