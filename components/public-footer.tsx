'use client';

import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';
import { PublicFooterBrand } from './public-footer-brand';
import { PublicFooterNav, usePublicFooterSections } from './public-footer-nav';

export function PublicFooter() {
  const { t } = useLanguage();
  const sections = usePublicFooterSections();

  return (
    <footer className="relative mt-8 border-t border-white/20 bg-muted/20 backdrop-blur-xl dark:border-white/10">
      <div
        className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="surface-3d rounded-2xl border border-white/25 bg-card/70 p-6 backdrop-blur-md sm:p-8 dark:border-white/10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <PublicFooterBrand />
            <PublicFooterNav sections={sections} />
          </div>
          <p className="mt-8 border-t border-white/15 pt-6 text-xs text-muted-foreground dark:border-white/10">
            © {new Date().getFullYear()} QRbanner. {t('footer.rights')} · {t('footer.questions')}{' '}
            <a href={supportMailto()} className="text-primary underline underline-offset-2 hover:no-underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
