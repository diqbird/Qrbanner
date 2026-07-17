import { Headphones, Paintbrush, Rocket, Shield } from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { Reveal } from './primitives';

const WHY = [
  { titleKey: 'premiumHome.why.designTitle', descKey: 'premiumHome.why.designDesc', Icon: Paintbrush },
  { titleKey: 'premiumHome.why.reliabilityTitle', descKey: 'premiumHome.why.reliabilityDesc', Icon: Shield },
  { titleKey: 'premiumHome.why.speedTitle', descKey: 'premiumHome.why.speedDesc', Icon: Rocket },
  { titleKey: 'premiumHome.why.supportTitle', descKey: 'premiumHome.why.supportDesc', Icon: Headphones },
] as const;

export async function PremiumWhy() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="py-16 sm:py-20" aria-labelledby="premium-why-heading">
      <div className="ph-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="premium-why-heading" className="ph-title text-3xl sm:text-4xl">
            {t('premiumHome.why.title')}
          </h2>
          <p className="mt-4 text-slate-600">{t('premiumHome.why.subtitle')}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item, i) => {
            const Icon = item.Icon;
            return (
              <Reveal key={item.titleKey} delay={i * 0.05}>
                <div className="ph-card h-full p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F172A] text-white">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{t(item.titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(item.descKey)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
