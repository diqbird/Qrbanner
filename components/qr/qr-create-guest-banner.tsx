'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';

/** Compact guest CTA above the sticky wizard footer (avoids eating the first viewport). */
export function QrCreateGuestBanner({
  saveGuestDraft,
  redirectGuestToSignup,
}: {
  saveGuestDraft: () => void;
  redirectGuestToSignup: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground sm:text-sm">
        <span className="font-medium text-foreground">{t('create.guestBannerTitle')}</span>
        <span className="hidden sm:inline"> — {t('create.guestBannerDesc')}</span>
      </p>
      <div className="flex shrink-0 gap-2">
        <Link
          href={`/login?callbackUrl=${encodeURIComponent('/qr/create?restore=1')}`}
          onClick={saveGuestDraft}
        >
          <Button variant="outline" size="sm">
            {t('common.signIn')}
          </Button>
        </Link>
        <Button size="sm" onClick={redirectGuestToSignup}>
          {t('common.signUp')}
        </Button>
      </div>
    </div>
  );
}
