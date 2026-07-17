import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { Reveal } from './primitives';

const STEPS = [
  { titleKey: 'premiumHome.process.step1', descKey: 'premiumHome.process.step1Desc' },
  { titleKey: 'premiumHome.process.step2', descKey: 'premiumHome.process.step2Desc' },
  { titleKey: 'premiumHome.process.step3', descKey: 'premiumHome.process.step3Desc' },
  { titleKey: 'premiumHome.process.step4', descKey: 'premiumHome.process.step4Desc' },
] as const;

export async function PremiumProcess() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="ph-surface py-16 sm:py-20" aria-labelledby="premium-process-heading">
      <div className="ph-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="premium-process-heading" className="ph-title text-3xl sm:text-4xl">
            {t('premiumHome.process.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('premiumHome.process.subtitle')}</p>
        </Reveal>

        <ol className="mt-12 grid gap-6 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.titleKey} delay={i * 0.06}>
              <li className="relative ph-card p-6 hover:translate-y-0 hover:scale-100">
                <span className="font-display text-4xl font-bold text-[#2563EB]/25 dark:text-sky-400/30">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{t(step.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(step.descKey)}</p>
                {i < STEPS.length - 1 && (
                  <div
                    className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-[#2563EB]/50 to-transparent lg:block"
                    aria-hidden
                  />
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
