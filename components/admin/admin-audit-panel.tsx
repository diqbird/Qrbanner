'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { useAdminAudit } from '@/hooks/use-admin-audit';
import { AdminAuditToolbar } from './admin-audit-toolbar';
import { AdminAuditTable } from './admin-audit-table';

export function AdminAuditPanel() {
  const audit = useAdminAudit();
  const { t } = audit;
  const retentionNote = useMemo(() => t('admin.audit.retention'), [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <ClipboardList className="h-5 w-5" /> {t('admin.audit.title')}
        </CardTitle>
        <CardDescription>{t('admin.audit.subtitle')}</CardDescription>
        <p className="text-xs text-muted-foreground">{retentionNote}</p>
        <AdminAuditToolbar audit={audit} />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <AdminAuditTable audit={audit} />
      </CardContent>
    </Card>
  );
}
