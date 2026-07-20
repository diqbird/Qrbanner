'use client';

import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';
import { PublicFooterBrand } from './public-footer-brand';
import { PublicFooterNav, usePublicFooterSections } from './public-footer-nav';

export function PublicFooter() {
  const { t } = useLanguage();
  const sections = usePublicFooterSections();

  return (
    <footer className="relative mt-8 border-t border-[var(--jt-rule,#D6CFC0)] bg-[var(--jt-tint,#EBE4D6)]/55">
      <div className="relative mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="rounded-sm border border-[var(--jt-rule,#D6CFC0)] bg-[var(--jt-paper,#F5F1E8)]/90 p-6 sm:p-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <PublicFooterBrand />
            <PublicFooterNav sections={sections} />
          </div>
          <p className="mt-8 border-t border-[var(--jt-rule,#D6CFC0)] pt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--jt-ink,#1C1917)]/55">
            © {new Date().getFullYear()} QRbanner. {t('footer.rights')} · {t('footer.questions')}{' '}
            <a
              href={supportMailto()}
              className="text-[var(--jt-ultramarine,#2430C8)] underline-offset-2 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
