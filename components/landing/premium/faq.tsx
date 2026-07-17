'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { getFaqItems } from '@/lib/i18n/faq-items';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { Reveal } from './primitives';

export function PremiumFaq() {
  const { t, locale } = useLanguage();
  const localePath = useLocalePath();
  const faqItems = getFaqItems(locale).slice(0, 6);

  return (
    <section className="border-y border-slate-200/70 bg-white/50 py-16 sm:py-20" aria-labelledby="premium-faq-heading">
      <div className="ph-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="premium-faq-heading" className="ph-title text-3xl sm:text-4xl">
            {t('premiumHome.faq.title')}
          </h2>
          <p className="mt-4 text-slate-600">{t('premiumHome.faq.subtitle')}</p>
        </Reveal>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200/80 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)]">
          {faqItems.map((item) => (
            <details key={item.question} className="group px-6 py-4">
              <summary className="cursor-pointer list-none font-medium text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-lg leading-none text-[#2563EB] transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={localePath('/faq')} className="ph-btn-secondary">
            {t('premiumHome.faq.viewAll')} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href={supportMailto()} className="ph-btn-secondary">
            <Mail className="h-4 w-4" aria-hidden />
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
