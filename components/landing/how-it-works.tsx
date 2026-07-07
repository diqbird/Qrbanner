'use client';

import { useInView } from 'react-intersection-observer';
import { Layers, Palette, Rocket, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleNumber } from '@/lib/i18n/format-locale';
import { getHowItWorksSteps } from '@/lib/i18n/how-it-works';

const STEP_ICONS = [Layers, Palette, Rocket, BarChart3];

export function LandingHowItWorks() {
  const { t, locale } = useLanguage();
  const steps = getHowItWorksSteps(locale);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('landing.howTitle')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('landing.howSubtitle')}</p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => {
            const Icon = STEP_ICONS[i] ?? Layers;
            return (
              <div
                key={item.step}
                className={`relative text-center ${inView ? 'animate-fade-up' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <span className="font-mono text-xs font-bold text-primary">
                  {formatLocaleNumber(i + 1, locale).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
