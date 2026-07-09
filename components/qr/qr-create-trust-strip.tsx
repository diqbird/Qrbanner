'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

/** Compact trust bridge for the create funnel (CRO: footer-only links are insufficient). */
export function QrCreateTrustStrip() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
      <span>{t('create.trustStripLead')}</span>
      <span className="hidden sm:inline" aria-hidden>
        ·
      </span>
      <Link href="/security" className="text-primary hover:underline">
        {t('nav.security')}
      </Link>
      <Link href="/privacy" className="text-primary hover:underline">
        {t('footer.privacy')}
      </Link>
      <Link href="/trust" className="text-primary hover:underline">
        {t('nav.trust')}
      </Link>
    </div>
  );
}
