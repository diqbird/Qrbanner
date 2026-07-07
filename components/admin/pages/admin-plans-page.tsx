'use client';

import { PLANS } from '@/lib/plans';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { AdminPageHeader } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AdminPlansPage() {
  const { t } = useLanguage();
  const { data } = useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('stats');
      return res.json();
    },
  });
  const counts = data?.planCounts ?? { free: 0, pro: 0, business: 0, agency: 0 };

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.plans')} description={t('superAdmin.plans.desc')} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.values(PLANS).map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                {plan.name}
                <Badge>{counts[plan.id as keyof typeof counts] ?? 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>{plan.priceLabel}</p>
              <p>{plan.maxQrCodes.toLocaleString()} QR · {plan.maxCustomDomains} domains</p>
              <p>{plan.analyticsRetentionDays ? `${plan.analyticsRetentionDays}d analytics` : 'Unlimited analytics'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
