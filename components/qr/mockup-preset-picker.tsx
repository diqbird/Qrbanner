'use client';

'use client';

import { Shirt, CreditCard, Image, Coffee, Upload } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveMockupPresetLabel } from '@/lib/i18n/resolve-mockup-preset-label';
import { MOCKUP_PRESETS, type MockupPresetId } from '@/lib/mockup-presets';
import type { MockupPreviewState } from '@/hooks/use-mockup-preview';

const PRESET_ICONS = {
  card: CreditCard,
  poster: Image,
  shirt: Shirt,
  mug: Coffee,
} as const;

export function MockupPresetPicker({
  active,
  isCustom,
  onSelectPreset,
  onSelectCustom,
}: {
  active: MockupPreviewState['active'];
  isCustom: boolean;
  onSelectPreset: (id: MockupPresetId) => void;
  onSelectCustom: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2">
      {MOCKUP_PRESETS.map((m) => {
        const Icon = PRESET_ICONS[m.id];
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelectPreset(m.id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              active === m.id
                ? 'border-primary bg-primary/10 text-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {resolveMockupPresetLabel(t, m.id, m.label)}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onSelectCustom}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
          isCustom
            ? 'border-primary bg-primary/10 text-foreground'
            : 'text-muted-foreground hover:bg-muted'
        }`}
      >
        <Upload className="h-3.5 w-3.5" /> {t('mockup.yourPhoto')}
      </button>
    </div>
  );
}
