'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { REFERRAL_REWARD_PRO_DAYS } from '@/lib/referral-rewards';

export function ReferralRewardClaim({
  eligible,
  claimed,
}: {
  eligible: boolean;
  claimed: boolean;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (claimed) {
    return (
      <p className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
        {t('referral.rewardClaimed')}
      </p>
    );
  }

  if (!eligible) return null;

  const claim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/referral/claim-reward', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('referral.rewardClaimFailed'));
        return;
      }
      toast.success(t('referral.rewardClaimSuccess', { days: REFERRAL_REWARD_PRO_DAYS }));
      if (data.redirect) {
        router.push(data.redirect);
        return;
      }
      router.refresh();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div className="space-y-2">
          <p className="text-sm font-medium">{t('referral.rewardEligibleTitle')}</p>
          <p className="text-sm text-muted-foreground">
            {t('referral.rewardEligibleDesc', { days: REFERRAL_REWARD_PRO_DAYS })}
          </p>
          <Button type="button" size="sm" onClick={claim} loading={loading}>
            {t('referral.claimReward')}
          </Button>
        </div>
      </div>
    </div>
  );
}
