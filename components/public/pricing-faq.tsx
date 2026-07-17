'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { Reveal } from '@/components/landing/premium/primitives';
import { getPricingFaqItems } from '@/lib/i18n/pricing-faq-items';

export function PricingFaq() {
  const { t, locale } = useLanguage();
  const items = getPricingFaqItems(locale);

  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="pricing-faq-heading">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="pricing-faq-heading" className="ph-title text-2xl sm:text-3xl">
          {t('pricing.faqTitle')}
        </h2>
        <p className="mt-3 text-muted-foreground">{t('pricing.faqSubtitle')}</p>
      </Reveal>
      <Reveal delay={0.08} className="mx-auto mt-8 max-w-3xl">
        <div className="divide-y divide-border/70 overflow-hidden rounded-[1.5rem] border border-border/70 bg-card/90 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-card/70 dark:shadow-[0_22px_48px_-28px_rgba(0,0,0,0.75)]">
          {items.map((item) => (
            <details key={item.question} className="group px-6 py-4">
              <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-lg leading-none text-[#2563EB] transition-transform group-open:rotate-45 dark:text-sky-400">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
