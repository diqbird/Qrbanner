'use client';

import { Switch } from '@/components/ui/switch';
import { LEAD_FIELD_KEYS } from '@/lib/landing-editor-utils';
import { defaultLeadForm, type LeadFormConfig } from '@/lib/landing-page';
import type { LandingPageEditorState } from '@/hooks/use-landing-page-editor';

type LandingEditorLeadFormProps = {
  editor: LandingPageEditorState;
};

export function LandingEditorLeadForm({ editor }: LandingEditorLeadFormProps) {
  const { t, data, set } = editor;

  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{t('landingEditor.leadFormTitle')}</p>
          <p className="text-xs text-muted-foreground">{t('landingEditor.leadFormDesc')}</p>
        </div>
        <Switch
          checked={Boolean(data.leadFormEnabled)}
          onCheckedChange={(v) =>
            set({
              leadFormEnabled: v,
              leadForm: data.leadForm ?? defaultLeadForm,
            })
          }
        />
      </div>
      {data.leadFormEnabled && (
        <div className="grid gap-3 sm:grid-cols-2">
          {LEAD_FIELD_KEYS.map(([key, labelKey]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <Switch
                checked={Boolean((data.leadForm ?? defaultLeadForm)[key])}
                onCheckedChange={(v) =>
                  set({
                    leadForm: {
                      ...(data.leadForm ?? defaultLeadForm),
                      [key]: v,
                    } as LeadFormConfig,
                  })
                }
              />
              {t(labelKey)}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <Switch
              checked={Boolean((data.leadForm ?? defaultLeadForm).requiredEmail)}
              onCheckedChange={(v) =>
                set({
                  leadForm: {
                    ...(data.leadForm ?? defaultLeadForm),
                    requiredEmail: v,
                  },
                })
              }
            />
            {t('landingEditor.requireEmail')}
          </label>
        </div>
      )}
    </div>
  );
}
