'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Gift } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatFreePlanReferralQrLabel } from '@/lib/i18n/dynamic-qr-label';

export function ReferralSignupBanner() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref')?.trim();
  const [state, setState] = useState<'loading' | 'valid' | 'hidden'>('loading');
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setState('hidden');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/referral/lookup?code=${encodeURIComponent(ref)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data?.valid) {
          setDisplayName(data.displayName ?? null);
          setState('valid');
        } else {
          setState('hidden');
        }
      } catch {
        if (!cancelled) setState('hidden');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ref]);

  if (state !== 'valid') return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
      <Gift className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p className="text-muted-foreground leading-relaxed">
        {displayName
          ? t('auth.referralInvitedBy', { name: displayName })
          : t('auth.referralInvitedGeneric', { qrLabel: formatFreePlanReferralQrLabel(locale) })}
      </p>
    </div>
  );
}
