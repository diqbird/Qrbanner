'use client';

import Link from 'next/link';
import { Zap, Building2, Workflow } from 'lucide-react';
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
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
      <h3 className="font-display text-sm font-semibold">{t('settings.integrations.presetsTitle')}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{t('settings.integrations.presetsSubtitle')}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {INTEGRATION_PRESETS.map((preset) => {
          const Icon = ICONS[preset.id];
          return (
            <li key={preset.id}>
              <Link
                href={preset.docsPath}
                className="flex h-full flex-col rounded-lg border border-border/50 bg-background p-3 transition-colors hover:border-primary/40 hover:bg-muted/30"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden />
                <span className="mt-2 text-sm font-medium">{preset.name}</span>
                <span className="mt-1 text-xs text-muted-foreground">{t(preset.descriptionKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
