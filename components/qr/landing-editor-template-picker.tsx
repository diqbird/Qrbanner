'use client';

import { Label } from '@/components/ui/label';
import {
  resolveLandingTemplateDescription,
  resolveLandingTemplateName,
} from '@/lib/i18n/resolve-landing-copy';
import { LANDING_TEMPLATES, type LandingTemplate } from '@/lib/landing-page';
import type { LandingPageEditorState } from '@/hooks/use-landing-page-editor';

type LandingEditorTemplatePickerProps = {
  editor: LandingPageEditorState;
};

export function LandingEditorTemplatePicker({ editor }: LandingEditorTemplatePickerProps) {
  const { t, data, set } = editor;

  return (
    <div className="space-y-2">
      <Label>{t('landingEditor.template')}</Label>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {LANDING_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => set({ template: tpl.id as LandingTemplate })}
            className={`rounded-lg border p-3 text-left transition-all ${
              data.template === tpl.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border/50 hover:border-border'
            }`}
          >
            <p className="text-sm font-medium">{resolveLandingTemplateName(t, tpl.id, tpl.name)}</p>
            <p className="text-xs text-muted-foreground">
              {resolveLandingTemplateDescription(t, tpl.id, tpl.description)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
