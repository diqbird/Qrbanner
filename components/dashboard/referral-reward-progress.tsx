'use client';

import { REFERRAL_MILESTONES, REFERRAL_REWARD_PRO_DAYS } from '@/lib/referral-rewards';
import { CheckCircle2, Circle } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function ReferralRewardProgress({ signupCount }: { signupCount: number }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{t('referral.rewardsTitle')}</p>
      <ul className="space-y-2">
        {REFERRAL_MILESTONES.map((m) => {
          const done = signupCount >= m;
          return (
            <li key={m} className="flex items-start gap-2 text-sm text-muted-foreground">
              {done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              )}
              <span className={done ? 'text-foreground' : ''}>
                {t(`referral.milestone${m}` as 'referral.milestone1', {
                  days: REFERRAL_REWARD_PRO_DAYS,
                })}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground">
        {t('referral.rewardsNote', { days: REFERRAL_REWARD_PRO_DAYS })}
      </p>
    </div>
  );
}
