'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

export function PricingReferralBanner() {
  const { data: session } = useSession() || {};
  const { t } = useLanguage();
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      setEligible(false);
      return;
    }
    let cancelled = false;
    fetch('/api/referral')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setEligible(Boolean(data?.rewardEligible));
      })
      .catch(() => {
        if (!cancelled) setEligible(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  if (!eligible) return null;

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
      <p className="flex items-center justify-center gap-2 text-center font-medium">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        {t('pricing.referralRewardBanner')}
      </p>
    </div>
  );
}
