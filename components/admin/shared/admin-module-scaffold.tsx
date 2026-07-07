'use client';

import { Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AdminModuleStatus } from '@/lib/admin/types';

export function AdminModuleScaffold({
  title,
  description,
  status = 'planned',
}: {
  title: string;
  description: string;
  status?: AdminModuleStatus;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <Badge variant="secondary">
            {status === 'beta' ? t('superAdmin.status.beta') : t('superAdmin.status.planned')}
          </Badge>
        }
      />
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-10 text-center">
        <Construction className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-4 font-medium">{t('superAdmin.scaffold.title')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('superAdmin.scaffold.desc')}</p>
      </div>
    </div>
  );
}
