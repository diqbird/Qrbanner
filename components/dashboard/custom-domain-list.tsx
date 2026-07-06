'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, RefreshCw, Trash2, Star } from 'lucide-react';
import type { CustomDomainsState } from '@/hooks/use-custom-domains';

export function CustomDomainList({ domains }: { domains: CustomDomainsState }) {
  const { t, domains: records, working, verifyDomain, setPrimary, removeDomain } = domains;

  if (records.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('settings.customDomain.empty')}</p>;
  }

  return (
    <div className="space-y-3">
      {records.map((d) => (
        <div
          key={d.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{d.domain}</span>
            {d.status === 'verified' ? (
              <Badge className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> {t('settings.customDomain.verifiedBadge')}
              </Badge>
            ) : (
              <Badge variant="secondary">{t('settings.customDomain.pending')}</Badge>
            )}
            {d.isPrimary && d.status === 'verified' && (
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3" /> {t('settings.customDomain.primary')}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {d.status !== 'verified' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => verifyDomain(d.id)}
                disabled={working}
                className="gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" /> {t('settings.customDomain.verifyDns')}
              </Button>
            )}
            {d.status === 'verified' && !d.isPrimary && (
              <Button size="sm" variant="outline" onClick={() => setPrimary(d.id)}>
                {t('settings.customDomain.setPrimary')}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeDomain(d.id, d.domain)}
              className="text-destructive"
              aria-label={t('common.removeAria')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
