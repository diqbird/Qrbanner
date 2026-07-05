'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';

export function CampaignWizardPromptGuestBanner({ wizard }: { wizard: CampaignWizardState }) {
  const { t } = wizard;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">{t('campaign.signInRequired')}</p>
        <Button asChild size="sm">
          <Link href={`/signup?callbackUrl=${encodeURIComponent('/qr/campaign')}`}>
            {t('campaign.signIn')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
