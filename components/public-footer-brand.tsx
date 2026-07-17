'use client';

import Link from 'next/link';
import { SiteLogo } from '@/components/brand/site-logo';
import { Mail } from 'lucide-react';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';

export function PublicFooterBrand() {
  const { t } = useLanguage();
  const localePath = useLocalePath();

  return (
    <div className="max-w-sm">
      <Link href={localePath('/')} className="inline-block">
        <SiteLogo layout="inline" size="sm" nameClassName="font-semibold" />
      </Link>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('footer.tagline')}</p>
      <a
        href={supportMailto()}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <Mail className="h-4 w-4" />
        {SUPPORT_EMAIL}
      </a>
    </div>
  );
}
