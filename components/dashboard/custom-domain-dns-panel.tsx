'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Copy } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { dnsPolicyVars } from '@/lib/i18n/policy-day-vars';
import type { CustomDomainsState } from '@/hooks/use-custom-domains';

export function CustomDomainAddPanel({ domains }: { domains: CustomDomainsState }) {
  const { t, scanBaseUrl, newDomain, setNewDomain, working, addDomain } = domains;

  return (
    <>
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">{t('settings.customDomain.scanBase')}</p>
        <p className="font-mono text-sm font-medium mt-1">{scanBaseUrl}</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder={t('settings.customDomain.placeholder')}
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDomain()}
        />
        <Button onClick={addDomain} disabled={working} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> {t('settings.customDomain.add')}
        </Button>
      </div>
    </>
  );
}

export function CustomDomainDnsPanel({ domains }: { domains: CustomDomainsState }) {
  const { t, locale } = useLanguage();
  const dnsVars = dnsPolicyVars(locale);
  const { domains: records, cnameTarget, pendingDns, copy } = domains;

  if (!pendingDns && !records.some((d) => d.status !== 'verified')) return null;

  return (
    <div className="rounded-lg border border-dashed p-4 space-y-3 text-sm">
      <p className="font-medium">{t('settings.customDomain.dnsTitle')}</p>
      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between gap-2 rounded bg-muted p-2">
          <span>{t('settings.customDomain.cname', { target: cnameTarget })}</span>
          <Button variant="ghost" size="sm" onClick={() => copy(cnameTarget)}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        {pendingDns && (
          <div className="rounded bg-muted p-2 space-y-1">
            <p>{t('settings.customDomain.txtHost', { host: pendingDns.txt.host })}</p>
            <div className="flex items-center justify-between gap-2">
              <span className="break-all">{pendingDns.txt.value}</span>
              <Button variant="ghost" size="sm" onClick={() => copy(pendingDns.txt.value)}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{t('settings.customDomain.dnsHint', dnsVars)}</p>
    </div>
  );
}
