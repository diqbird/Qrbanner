'use client';

import Link from 'next/link';
import { Zap, Building2, Workflow, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { INTEGRATION_PRESETS } from '@/lib/integration-presets';

const ICONS = {
  zapier: Zap,
  hubspot: Building2,
  make: Workflow,
} as const;

export function IntegrationPresetCards() {
  const { t } = useLanguage();

  return (
    <div className="surface-3d rounded-2xl border border-white/30 bg-card/70 p-4 backdrop-blur-md dark:border-white/10">
      <h3 className="font-display text-sm font-semibold">{t('settings.integrations.presetsTitle')}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{t('settings.integrations.presetsSubtitle')}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {INTEGRATION_PRESETS.map((preset) => {
          const Icon = ICONS[preset.id];
          return (
            <li key={preset.id}>
              <Link
                href={preset.docsPath}
                className="menu-item-3d flex h-full flex-col rounded-xl border border-white/20 bg-background/50 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 dark:border-white/10"
              >
                <span className="flex items-center justify-between gap-2">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                </span>
                <span className="mt-2 text-sm font-medium">{preset.name}</span>
                <span className="mt-1 text-xs text-muted-foreground">{t(preset.descriptionKey)}</span>
                <span className="mt-2 text-[11px] leading-snug text-muted-foreground/90">{preset.webhookHint}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
