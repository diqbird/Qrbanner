'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import { HELP_SECTIONS } from '@/lib/i18n/help-content';
import { proTrialDayVars } from '@/lib/i18n/policy-day-vars';
import { SUPPORT_EMAIL, supportMailto } from '@/lib/site-contact';

export function HelpPageContent() {
  const { t: translate, locale } = useLanguage();
  const localePath = useLocalePath();
  const trialVars = proTrialDayVars(locale);
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(key, { ...trialVars, ...vars });

  return (
    <>
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t('help.pageTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('help.pageSubtitle')}</p>
      </header>

      <div className="mt-12 space-y-10">
        {HELP_SECTIONS.map((section) => (
          <section key={section.id}>
            <h2 className="font-display text-xl font-semibold">{t(section.titleKey)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t(section.descKey)}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {section.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={localePath(topic.href)}
                  className="group flex flex-col rounded-xl border border-border/50 bg-card/80 p-5 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <p className="font-medium group-hover:text-primary">{t(topic.titleKey)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(topic.descKey)}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {t('common.learnMore')} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
        <Mail className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-3 font-display text-xl font-semibold">{t('help.stillNeedHelp')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t('help.contactDesc')}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a href={supportMailto('QRbanner Help Request')}>
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </Button>
          </a>
          <Link href={localePath('/contact')}>
            <Button variant="outline">{t('help.contactForm')}</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
