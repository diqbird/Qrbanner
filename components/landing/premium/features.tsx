import {
  BarChart3,
  FolderKanban,
  Globe2,
  LayoutTemplate,
  Palette,
  QrCode,
  ShieldCheck,
  Webhook,
} from 'lucide-react';
import { getServerLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n';
import { Reveal } from './primitives';

const FEATURES = [
  { titleKey: 'premiumHome.features.dynamicTitle', descKey: 'premiumHome.features.dynamicDesc', Icon: QrCode },
  { titleKey: 'premiumHome.features.brandTitle', descKey: 'premiumHome.features.brandDesc', Icon: Palette },
  { titleKey: 'premiumHome.features.analyticsTitle', descKey: 'premiumHome.features.analyticsDesc', Icon: BarChart3 },
  { titleKey: 'premiumHome.features.bulkTitle', descKey: 'premiumHome.features.bulkDesc', Icon: FolderKanban },
  { titleKey: 'premiumHome.features.apiTitle', descKey: 'premiumHome.features.apiDesc', Icon: Webhook },
  { titleKey: 'premiumHome.features.securityTitle', descKey: 'premiumHome.features.securityDesc', Icon: ShieldCheck },
  { titleKey: 'premiumHome.features.templatesTitle', descKey: 'premiumHome.features.templatesDesc', Icon: LayoutTemplate },
  { titleKey: 'premiumHome.features.localeTitle', descKey: 'premiumHome.features.localeDesc', Icon: Globe2 },
] as const;

export async function PremiumFeatures() {
  const locale = await getServerLocale();
  const t = (key: string) => translate(locale, key);

  return (
    <section className="ph-surface py-16 sm:py-20" aria-labelledby="premium-features-heading">
      <div className="ph-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="premium-features-heading" className="ph-title text-3xl sm:text-4xl">
            {t('premiumHome.features.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('premiumHome.features.subtitle')}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.Icon;
            return (
              <Reveal key={feature.titleKey} delay={i * 0.04}>
                <div className="ph-card h-full p-5 hover:translate-y-0 hover:scale-100">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(feature.descKey)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
