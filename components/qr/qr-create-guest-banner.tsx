'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/i18n/language-provider';

export function QrCreateGuestBanner({
  saveGuestDraft,
  redirectGuestToSignup,
}: {
  saveGuestDraft: () => void;
  redirectGuestToSignup: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{t('create.guestBannerTitle')}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('create.guestBannerDesc')}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href={`/login?callbackUrl=${encodeURIComponent('/qr/create?restore=1')}`}
            onClick={saveGuestDraft}
          >
            <Button variant="outline" size="sm">{t('common.signIn')}</Button>
          </Link>
          <Button size="sm" onClick={redirectGuestToSignup}>
            {t('common.signUp')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
