'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';
import { Reveal } from '@/components/landing/premium/primitives';
import { getFaqItems } from '@/lib/i18n/faq-items';

export function FaqPageContent() {
  const { t, locale } = useLanguage();
  const items = getFaqItems(locale);

  return (
    <>
      <Reveal className="relative text-center">
        <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
          <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
        </div>
        <p className="ph-eyebrow mb-4">{t('nav.faq')}</p>
        <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('faq.pageTitle')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('faq.pageSubtitle')}</p>
      </Reveal>

      <div className="mt-12 space-y-3">
        {items.map((item, index) => (
          <Reveal key={item.question} delay={Math.min(index * 0.02, 0.2)}>
            <article className="ph-card p-6 hover:translate-y-0 hover:scale-100">
              <h2 className="ph-title text-lg">{item.question}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <div className="ph-dark-band overflow-hidden rounded-[1.5rem] p-8 text-center text-white">
          <Mail className="mx-auto h-8 w-8 text-cyan-300" aria-hidden />
          <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">{t('faq.stillNeedHelp')}</h2>
          <p className="mt-2 text-sm text-slate-300">{t('faq.supportDesc')}</p>
          <a
            href={supportMailto('QRbanner Support Request')}
            className="ph-btn-primary mt-5 bg-white text-slate-900 shadow-none hover:bg-slate-100"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {SUPPORT_EMAIL}
          </a>
        </div>
      </Reveal>

      <Reveal className="mt-8 text-center">
        <Link href="/signup" className="ph-btn-primary">
          {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Reveal>
    </>
  );
}
