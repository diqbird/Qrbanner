'use client';

import { Headphones, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/i18n/language-provider';
import { ENTERPRISE_UPTIME_SLA_PERCENT } from '@/lib/i18n/api-rate-limits';
import { formatLocaleDecimal } from '@/lib/i18n/format-locale';
import type { EnterpriseWorkspaceState } from '@/hooks/use-enterprise-workspace';

export function EnterpriseSupportCard({ enterprise }: { enterprise: EnterpriseWorkspaceState }) {
  const { t, locale } = useLanguage();
  const { state } = enterprise;
  if (!state) return null;

  const { workspace } = state;
  const tier = workspace.supportTier || 'standard';
  if (tier !== 'priority' && tier !== 'enterprise') return null;

  const uptime = workspace.slaUptimePercent ?? ENTERPRISE_UPTIME_SLA_PERCENT;
  const uptimeLabel = `${formatLocaleDecimal(uptime, locale, 1)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Headphones className="h-5 w-5 text-primary" />
          {t('enterpriseSupport.title')}
        </CardTitle>
        <CardDescription>{t('enterpriseSupport.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{t(`enterpriseSupport.tier.${tier}`)}</Badge>
          <span className="text-muted-foreground">
            {t('enterpriseSupport.uptime', { percent: uptimeLabel })}
          </span>
        </div>
        {(workspace.assignedCsmName || workspace.assignedCsmEmail) && (
          <div className="rounded-lg border border-border/50 p-3 space-y-1">
            <p className="font-medium">{t('enterpriseSupport.csmTitle')}</p>
            {workspace.assignedCsmName ? <p>{workspace.assignedCsmName}</p> : null}
            {workspace.assignedCsmEmail ? (
              <a
                href={`mailto:${workspace.assignedCsmEmail}`}
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                {workspace.assignedCsmEmail}
              </a>
            ) : null}
          </div>
        )}
        {workspace.slaNotes ? (
          <div>
            <p className="font-medium mb-1">{t('enterpriseSupport.slaNotes')}</p>
            <p className="text-muted-foreground whitespace-pre-wrap">{workspace.slaNotes}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
