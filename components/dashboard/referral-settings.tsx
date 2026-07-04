'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { ReferralRewardProgress } from './referral-reward-progress';
import { ReferralRewardClaim } from './referral-reward-claim';
import { getReferralRewardProgress } from '@/lib/referral-rewards';

export function ReferralSettings() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState('');
  const [signupCount, setSignupCount] = useState(0);
  const [rewards, setRewards] = useState(() => getReferralRewardProgress(0));
  const [rewardEligible, setRewardEligible] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/referral');
      if (res.ok) {
        const data = await res.json();
        setLink(data.link ?? '');
        setSignupCount(data.signupCount ?? 0);
        if (data.rewards) {
          setRewards(data.rewards);
        } else {
          setRewards(getReferralRewardProgress(data.signupCount ?? 0));
        }
        const b = data.branding ?? {};
        setRewardEligible(Boolean(data.rewardEligible));
        setRewardClaimed(Boolean(data.rewardClaimed ?? b.referralRewardClaimed));
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast.success(t('referral.copied'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  if (loading) {
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
            <Input readOnly value={link} className="font-mono text-sm" />
            <Button type="button" variant="outline" size="icon" onClick={copyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('referral.signups', { count: signupCount })}
          </p>
          {rewards.nextMilestone !== null && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('referral.progressLabel')}</span>
                <span>
                  {signupCount} / {rewards.nextMilestone}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${rewards.progressPercent}%` }}
                />
              </div>
            </div>
          )}
          <ReferralRewardProgress signupCount={signupCount} />
          <ReferralRewardClaim eligible={rewardEligible} claimed={rewardClaimed} />
        </CardContent>
      </Card>
  );
}
