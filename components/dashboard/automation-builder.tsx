'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useAutomationBuilder } from '@/hooks/use-automation-builder';
import { AutomationFlowList } from './automation-flow-list';
import { AutomationLogsPanel } from './automation-logs-panel';
import { AutomationFlowEditorDialog } from './automation-flow-editor-dialog';

export function AutomationBuilder() {
  const { t } = useLanguage();
  const builder = useAutomationBuilder();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" /> {t('settings.automations.title')}
          </CardTitle>
          <CardDescription>{t('settings.automations.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AutomationFlowList builder={builder} />
          <AutomationLogsPanel builder={builder} />
        </CardContent>
      </Card>

      <AutomationFlowEditorDialog builder={builder} />
    </>
  );
}
