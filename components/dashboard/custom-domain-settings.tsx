'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { useCustomDomains } from '@/hooks/use-custom-domains';
import { CustomDomainAddPanel, CustomDomainDnsPanel } from './custom-domain-dns-panel';
import { CustomDomainList } from './custom-domain-list';

export function CustomDomainSettings() {
  const domains = useCustomDomains();
  const { t, loading } = domains;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" /> {t('settings.customDomain.title')}
        </CardTitle>
        <CardDescription>{t('settings.customDomain.desc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <>
            <CustomDomainAddPanel domains={domains} />
            <CustomDomainDnsPanel domains={domains} />
            <CustomDomainList domains={domains} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
