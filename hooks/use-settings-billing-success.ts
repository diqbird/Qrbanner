'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useSettingsBillingSuccess({
  t,
  setPlanRefresh,
}: {
  t: (key: string) => string;
  setPlanRefresh: React.Dispatch<React.SetStateAction<number>>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('billing') !== 'success') return;
    if (searchParams.get('_ptxn')) return;
    toast.success(t('pricing.billingSuccess'));
    setPlanRefresh((k) => k + 1);
    router.replace('/settings?tab=plan');
    let attempts = 0;
    const poll = window.setInterval(() => {
      attempts += 1;
      setPlanRefresh((k) => k + 1);
      if (attempts >= 5) window.clearInterval(poll);
    }, 2500);
    return () => window.clearInterval(poll);
  }, [searchParams, router, t, setPlanRefresh]);
}
