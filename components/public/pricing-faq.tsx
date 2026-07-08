'use client';

import { useLanguage } from '@/components/i18n/language-provider';
import { getPricingFaqItems } from '@/lib/i18n/pricing-faq-items';

export function PricingFaq() {
  const { t, locale } = useLanguage();
  const items = getPricingFaqItems(locale);

  return (
    <section className="mt-16" aria-labelledby="pricing-faq-heading">
      <h2 id="pricing-faq-heading" className="text-center font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {t('pricing.faqTitle')}
      </h2>
      <p className="mt-3 text-center text-muted-foreground">{t('pricing.faqSubtitle')}</p>
      <div className="mx-auto mt-8 max-w-3xl divide-y divide-border/60 rounded-xl border border-border/50 bg-card/80">
        {items.map((item) => (
          <details key={item.question} className="group px-6 py-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-primary text-lg leading-none transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
