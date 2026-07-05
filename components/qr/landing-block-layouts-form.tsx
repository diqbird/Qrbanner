'use client';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { LandingBlockFieldProps } from './landing-block-field-types';

export function LandingBlockLeadFormLayout({ block, patch, t }: LandingBlockFieldProps) {
  if (block.type !== 'leadForm') return null;
  const cfg = block.config;
  const setCfg = (p: Partial<typeof cfg>) => patch({ config: { ...cfg, ...p } });
  const rows: [keyof typeof cfg, string][] = [
    ['collectName', 'landingEditor.fieldName'],
    ['collectEmail', 'landingEditor.fieldEmail'],
    ['collectPhone', 'landingEditor.fieldPhone'],
    ['collectMessage', 'landingEditor.fieldMessage'],
  ];

  return (
    <div className="space-y-3">
      <Input
        placeholder={t('landingBuilder.submitLabelPlaceholder')}
        value={block.submitLabel ?? ''}
        onChange={(e) => patch({ submitLabel: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        {rows.map(([key, labelKey]) => (
          <label key={String(key)} className="flex items-center gap-2 text-sm">
            <Switch
              checked={Boolean(cfg[key])}
              onCheckedChange={(v) => setCfg({ [key]: v } as Partial<typeof cfg>)}
            />
            {t(labelKey)}
          </label>
        ))}
        <label className="col-span-2 flex items-center gap-2 text-sm">
          <Switch
            checked={Boolean(cfg.requiredEmail)}
            onCheckedChange={(v) => setCfg({ requiredEmail: v })}
          />
          {t('landingEditor.requireEmail')}
        </label>
      </div>
    </div>
  );
}
