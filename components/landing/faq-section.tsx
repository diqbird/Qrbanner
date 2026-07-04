'use client';

import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { getFaqItems } from '@/lib/i18n/faq-items';

export function LandingFAQ() {
  const { t, locale } = useLanguage();
  const faqItems = getFaqItems(locale);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28" ref={ref} aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="faq-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('landing.faqTitle')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('landing.faqSubtitle')}</p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border/60 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
          {faqItems.slice(0, 6).map((item, i) => (
            <div
              key={item.question}
              className={inView ? 'animate-fade-up' : ''}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <details className="group px-6 py-4">
                <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-primary text-lg leading-none transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/faq">
            <Button variant="outline" className="gap-2">
              {t('landing.faqViewAll')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href={supportMailto()}>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" aria-hidden />
              {SUPPORT_EMAIL}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
