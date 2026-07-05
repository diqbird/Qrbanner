'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';
import { ReferralRewardProgress } from './referral-reward-progress';
import { ReferralRewardClaim } from './referral-reward-claim';
import type { ReferralSettingsData } from '@/lib/referral-settings-utils';

export function ReferralSettingsLinkPanel({ view }: { view: ReferralSettingsData }) {
  const { t } = useLanguage();

  const copyLink = async () => {
    if (!view.link) return;
    try {
      await navigator.clipboard.writeText(view.link);
      toast.success(t('referral.copied'));
    } catch {
      toast.error(t('auth.somethingWrong'));
    }
  };

  return (
    <>
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
    </>
  );
}
