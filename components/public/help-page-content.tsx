'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
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
      <header className="relative text-center">
        <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center" aria-hidden>
          <div className="h-40 w-72 rounded-full bg-[#2563EB]/15 blur-[70px] dark:bg-[#2563EB]/25" />
        </div>
        <p className="ph-eyebrow mb-4">{t('nav.help')}</p>
        <h1 className="ph-title text-4xl leading-[1.1] sm:text-5xl">{t('help.pageTitle')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('help.pageSubtitle')}</p>
      </header>

      <div className="mt-12 space-y-10">
        {HELP_SECTIONS.map((section) => (
          <section key={section.id}>
            <h2 className="ph-title text-xl">{t(section.titleKey)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t(section.descKey)}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {section.topics.map((topic) => (
                <Link key={topic.id} href={localePath(topic.href)} className="ph-card group flex flex-col p-5">
                  <p className="font-medium group-hover:text-[#2563EB] dark:group-hover:text-sky-400">
                    {t(topic.titleKey)}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(topic.descKey)}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-[#2563EB] opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400">
                    {t('common.learnMore')} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="ph-dark-band mt-12 overflow-hidden rounded-[1.5rem] p-8 text-center text-white">
        <Mail className="mx-auto h-8 w-8 text-cyan-300" aria-hidden />
        <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">{t('help.stillNeedHelp')}</h2>
        <p className="mt-2 text-sm text-slate-300">{t('help.contactDesc')}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href={supportMailto('QRbanner Help Request')}
            className="ph-btn-primary bg-white text-slate-900 shadow-none hover:bg-slate-100"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {SUPPORT_EMAIL}
          </a>
          <Link href={localePath('/contact')} className="ph-btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">
            {t('footer.contact')}
          </Link>
        </div>
      </div>
    </>
  );
}
