import type {
  AutomationAction,
  AutomationCondition,
  AutomationFlowData,
  AutomationTrigger,
} from '@/lib/automation-types';

export const AUTOMATION_TRIGGERS: AutomationTrigger[] = ['scan', 'lead', 'cta_click'];
export const AUTOMATION_ACTION_TYPES = ['slack', 'discord', 'email', 'webhook'] as const;

export type AutomationActionType = (typeof AUTOMATION_ACTION_TYPES)[number];

export interface AutomationFlowRow extends AutomationFlowData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationLogRow {
  id: string;
  flowId: string;
  flowName: string;
  trigger: string;
  success: boolean;
  error: string | null;
  createdAt: string;
}

export interface AutomationQrOption {
  id: string;
  name: string;
  shortCode: string;
}

export function defaultAutomationAction(type: AutomationActionType = 'slack'): AutomationAction {
  switch (type) {
    case 'discord':
      return { type: 'discord', webhookUrl: '', message: 'Event: {{qrName}} — {{country}}' };
    case 'email':
      return {
        type: 'email',
        to: '',
        subject: 'QRbanner: {{qrName}}',
        body: 'Trigger fired for {{shortCode}} from {{country}}.',
      };
    case 'webhook':
      return { type: 'webhook', url: '' };
    default:
      return { type: 'slack', webhookUrl: '', message: 'New event: {{qrName}} from {{country}}' };
  }
}

export function emptyAutomationDraft(): AutomationFlowData {
  return {
    name: '',
    enabled: true,
    trigger: 'scan',
    qrCodeId: null,
    conditions: [],
    actions: [defaultAutomationAction()],
  };
}

export function parseAutomationFlow(raw: AutomationFlowRow): AutomationFlowData {
  return {
    name: raw.name,
    enabled: raw.enabled,
    trigger: raw.trigger,
    qrCodeId: raw.qrCodeId ?? null,
    conditions: Array.isArray(raw.conditions) ? (raw.conditions as AutomationCondition[]) : [],
    actions: Array.isArray(raw.actions) ? (raw.actions as AutomationAction[]) : [defaultAutomationAction()],
  };
}

export type AutomationsListData = {
  flows: AutomationFlowRow[];
  limit: number;
};

export function parseAutomationsList(json: unknown): AutomationsListData {
  const data = json as Record<string, unknown>;
  return {
    flows: (data.flows as AutomationFlowRow[]) ?? [],
    limit: Number(data.limit ?? 3),
  };
}
