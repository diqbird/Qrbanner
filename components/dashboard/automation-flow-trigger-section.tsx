'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationTrigger } from '@/lib/automation-types';
import { AUTOMATION_TRIGGERS } from '@/lib/automation-flow-utils';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';

type AutomationFlowTriggerSectionProps = {
  builder: AutomationBuilderState;
};

export function AutomationFlowTriggerSection({ builder }: AutomationFlowTriggerSectionProps) {
  const { t } = useLanguage();
  const { draft, setDraft, qrOptions } = builder;

  const triggerLabel = (trigger: AutomationTrigger) => t(`settings.automations.trigger.${trigger}`);

  return (
    <div className="space-y-4 rounded-lg border border-border/50 p-4">
      <p className="text-sm font-semibold">{t('settings.automations.when')}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('settings.automations.triggerLabel')}</Label>
          <Select
            value={draft.trigger}
            onValueChange={(v) => setDraft((p) => ({ ...p, trigger: v as AutomationTrigger }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUTOMATION_TRIGGERS.map((tr) => (
                <SelectItem key={tr} value={tr}>
                  {triggerLabel(tr)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('settings.automations.qrFilter')}</Label>
          <Select
            value={draft.qrCodeId ?? '__all__'}
            onValueChange={(v) => setDraft((p) => ({ ...p, qrCodeId: v === '__all__' ? null : v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{t('settings.automations.allQr')}</SelectItem>
              {qrOptions.map((qr) => (
                <SelectItem key={qr.id} value={qr.id}>
                  {qr.name} ({qr.shortCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
