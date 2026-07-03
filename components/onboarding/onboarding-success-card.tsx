'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper, Download, LayoutDashboard, X } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { isOnboardingQuery } from '@/lib/onboarding';
import { OnboardingProgress } from './onboarding-progress';

const DISMISS_KEY = 'qrb_onboarding_first_qr_done';

export function OnboardingSuccessCard({ qrId, qrName }: { qrId: string; qrName: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isOnboardingQuery(searchParams.get('onboarding'))) return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* ignore */
    }
    setVisible(true);
  }, [searchParams]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
    router.replace(`/qr/${qrId}`);
  };

  const scrollToDownload = () => {
    document.getElementById('qr-download-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!visible) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-background">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <PartyPopper className="h-6 w-6 shrink-0 text-primary" aria-hidden />
            <div>
              <h2 className="font-display font-semibold">{t('onboarding.successTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('onboarding.successDesc', { name: qrName })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="text-muted-foreground hover:text-foreground"
            aria-label={t('common.dismissAria')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <OnboardingProgress step={3} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="gap-2" onClick={scrollToDownload}>
            <Download className="h-4 w-4" />
            {t('onboarding.successDownload')}
          </Button>
          <Button type="button" variant="outline" className="gap-2" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              {t('onboarding.successDashboard')}
            </Link>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={dismiss}>
            {t('onboarding.dismiss')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
