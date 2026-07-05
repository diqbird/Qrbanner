'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/components/i18n/language-provider';
import type { AutomationBuilderState } from '@/hooks/use-automation-builder';
import { AutomationFlowTriggerSection } from './automation-flow-trigger-section';
import { AutomationFlowConditionsSection } from './automation-flow-conditions-section';
import { AutomationFlowActionsSection } from './automation-flow-actions-section';

type AutomationFlowEditorDialogProps = {
  builder: AutomationBuilderState;
};

export function AutomationFlowEditorDialog({ builder }: AutomationFlowEditorDialogProps) {
  const { t } = useLanguage();
  const { dialogOpen, setDialogOpen, editingId, draft, setDraft, working, saveFlow } = builder;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingId ? t('settings.automations.editTitle') : t('settings.automations.createTitle')}
          </DialogTitle>
          <DialogDescription>{t('settings.automations.editorDesc')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label>{t('settings.automations.flowName')}</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              placeholder={t('settings.automations.flowNamePlaceholder')}
            />
          </div>

          <AutomationFlowTriggerSection builder={builder} />
          <AutomationFlowConditionsSection builder={builder} />
          <AutomationFlowActionsSection builder={builder} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={saveFlow} loading={working}>
            {editingId ? t('common.save') : t('settings.automations.createBtn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
