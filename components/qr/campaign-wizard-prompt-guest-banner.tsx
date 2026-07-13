'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CampaignWizardState } from '@/hooks/use-campaign-wizard';
import { saveCampaignGuestDraft } from '@/lib/campaign-guest-draft';

export function CampaignWizardPromptGuestBanner({ wizard }: { wizard: CampaignWizardState }) {
  const { t, prompt, businessName, websiteUrl } = wizard;

  const persist = () => {
    saveCampaignGuestDraft({ prompt, businessName, websiteUrl });
  };

  const callback = encodeURIComponent('/qr/campaign');

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">{t('campaign.signInRequired')}</p>
        <div className="flex shrink-0 gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/login?callbackUrl=${callback}`} onClick={persist}>
              {t('common.signIn')}
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/signup?callbackUrl=${callback}`} onClick={persist}>
              {t('campaign.signUp')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
