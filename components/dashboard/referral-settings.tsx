'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { ReferralRewardProgress } from './referral-reward-progress';
import { ReferralRewardClaim } from './referral-reward-claim';
import { getReferralRewardProgress } from '@/lib/referral-rewards';
import { useSettingsResource } from '@/hooks/use-settings-resource';

type ReferralData = {
  link: string;
  signupCount: number;
  rewards: ReturnType<typeof getReferralRewardProgress>;
  rewardEligible: boolean;
  rewardClaimed: boolean;
};

function parseReferral(json: unknown): ReferralData {
  const data = json as {
    link?: string;
    signupCount?: number;
    rewards?: ReturnType<typeof getReferralRewardProgress>;
    rewardEligible?: boolean;
    rewardClaimed?: boolean;
    branding?: { referralRewardClaimed?: boolean };
  };
  const signupCount = data.signupCount ?? 0;
  return {
    link: data.link ?? '',
    signupCount,
    rewards: data.rewards ?? getReferralRewardProgress(signupCount),
    rewardEligible: Boolean(data.rewardEligible),
    rewardClaimed: Boolean(data.rewardClaimed ?? data.branding?.referralRewardClaimed),
  };
}

export function ReferralSettings() {
  const { t } = useLanguage();
  const { data, loading } = useSettingsResource({ url: '/api/referral', parse: parseReferral });
  const [view, setView] = useState<ReferralData | null>(null);

  useEffect(() => {
    if (data) setView(data);
  }, [data]);

  const copyLink = async () => {
    if (!view?.link) return;
    try {
      await navigator.clipboard.writeText(view.link);
      toast.success(t('referral.copied'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  if (loading || !view) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          {t('referral.title')}
        </CardTitle>
        <CardDescription>{t('referral.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input readOnly value={view.link} className="font-mono text-sm" />
          <Button type="button" variant="outline" size="icon" onClick={copyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('referral.signups', { count: view.signupCount })}
        </p>
        {view.rewards.nextMilestone !== null && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('referral.progressLabel')}</span>
              <span>
                {view.signupCount} / {view.rewards.nextMilestone}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${view.rewards.progressPercent}%` }}
              />
            </div>
          </div>
        )}
        <ReferralRewardProgress signupCount={view.signupCount} />
        <ReferralRewardClaim eligible={view.rewardEligible} claimed={view.rewardClaimed} />
      </CardContent>
    </Card>
  );
}
