'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';

type CampaignWizardDoneStepProps = {
  wizard: CampaignWizardState;
};

export function CampaignWizardCreatingStep({ t }: { t: (key: string) => string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{t('campaign.creating')}</p>
    </div>
  );
}

export function CampaignWizardDoneStep({ wizard }: CampaignWizardDoneStepProps) {
  const { locale } = useLanguage();
  const { t, result } = wizard;
  if (!result) return null;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <div>
          <h2 className="font-display text-xl font-bold">{t('campaign.successTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('campaign.successSubtitle')}</p>
          <p className="mt-2 text-sm font-medium">
            {t('campaign.itemsCount', { count: formatLocaleNumber(result.created.length, locale) })}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={`/dashboard?batchId=${result.campaignId}`}>{t('campaign.viewDashboard')}</Link>
          </Button>
          {result.created[0] && (
            <Button variant="outline" asChild>
              <Link href={`/qr/${result.created[0].id}`}>{t('campaign.editFirst')}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
