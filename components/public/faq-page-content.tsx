'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';
import { useLanguage } from '@/components/i18n/language-provider';
import { getFaqItems } from '@/lib/i18n/faq-items';

export function FaqPageContent() {
  const { t, locale } = useLanguage();
  const items = getFaqItems(locale);

  return (
    <>
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t('faq.pageTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('faq.pageSubtitle')}</p>
      </header>

      <div className="mt-12 space-y-4">
        {items.map((item) => (
          <article
            key={item.question}
            className="rounded-xl border border-border/50 bg-card/80 p-6 backdrop-blur-sm"
          >
            <h2 className="font-display text-lg font-semibold">{item.question}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
        <Mail className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-3 font-display text-xl font-semibold">{t('faq.stillNeedHelp')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t('faq.supportDesc')}</p>
        <a href={supportMailto('QRbanner Support Request')} className="mt-4 inline-block">
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            {SUPPORT_EMAIL}
          </Button>
        </a>
      </div>

      <div className="mt-8 text-center">
        <Link href="/signup">
          <Button size="lg" className="gap-2">
            {t('common.getStartedFree')} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </>
  );
}
