'use client';

import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';
import { PublicFooterBrand } from './public-footer-brand';
import { PublicFooterNav, usePublicFooterSections } from './public-footer-nav';

export function PublicFooter() {
  const { t } = useLanguage();
  const sections = usePublicFooterSections();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <PublicFooterBrand />
          <PublicFooterNav sections={sections} />
        </div>
        <p className="mt-8 border-t border-border/40 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} QRbanner. {t('footer.rights')} · {t('footer.questions')}{' '}
          <a href={supportMailto()} className="text-primary underline underline-offset-2 hover:no-underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </footer>
  );
}
