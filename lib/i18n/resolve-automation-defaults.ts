import type { AutomationAction, AutomationFlowData } from '@/lib/automation-types';
import type { AutomationActionType } from '@/lib/automation-flow-utils';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function defaultAutomationActionLocalized(
  t: TranslateFn,
  type: AutomationActionType = 'slack',
): AutomationAction {
  switch (type) {
    case 'discord':
      return {
        type: 'discord',
        webhookUrl: '',
        message: resolved(
          t,
          'settings.automations.defaults.discordMessage',
          'Event: {{qrName}} — {{country}}',
        ),
      };
    case 'email':
      return {
        type: 'email',
        to: '',
        subject: resolved(t, 'settings.automations.defaults.emailSubject', 'QRbanner: {{qrName}}'),
        body: resolved(
          t,
          'settings.automations.defaults.emailBody',
          'Trigger fired for {{shortCode}} from {{country}}.',
        ),
      };
    case 'webhook':
      return { type: 'webhook', url: '' };
    default:
      return {
        type: 'slack',
        webhookUrl: '',
        message: resolved(
          t,
          'settings.automations.defaults.slackMessage',
          'New event: {{qrName}} from {{country}}',
        ),
      };
  }
}

export function emptyAutomationDraftLocalized(t: TranslateFn): AutomationFlowData {
  return {
    name: '',
    enabled: true,
    trigger: 'scan',
    qrCodeId: null,
    conditions: [],
    actions: [defaultAutomationActionLocalized(t)],
  };
}
