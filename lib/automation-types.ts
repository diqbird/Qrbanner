export type AutomationTrigger = 'scan' | 'lead' | 'cta_click';

export type AutomationCondition =
  | { type: 'country'; op: 'eq' | 'neq'; value: string }
  | { type: 'device'; op: 'eq'; value: string };

export type AutomationAction =
  | { type: 'slack'; webhookUrl: string; message: string }
  | { type: 'discord'; webhookUrl: string; message: string }
  | { type: 'email'; to: string; subject: string; body: string }
  | { type: 'webhook'; url: string; body?: string };

export type AutomationFlowData = {
  id?: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  qrCodeId?: string | null;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
};

export const AUTOMATION_TRIGGERS: AutomationTrigger[] = ['scan', 'lead', 'cta_click'];

export const MAX_AUTOMATION_CONDITIONS = 5;
export const MAX_AUTOMATION_ACTIONS = 5;
export const MAX_FLOWS_PER_USER = 20;

export type AutomationContext = {
  trigger: AutomationTrigger;
  userId: string;
  workspaceId?: string | null;
  qrCodeId: string;
  qrName: string;
  shortCode: string;
  country?: string | null;
  city?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  email?: string | null;
  leadName?: string | null;
  leadPhone?: string | null;
  leadMessage?: string | null;
  ctaLabel?: string | null;
  scannedAt?: string;
};

export const TEMPLATE_VAR_KEYS = [
  'qrName',
  'shortCode',
  'country',
  'city',
  'device',
  'email',
  'leadName',
  'ctaLabel',
] as const;

/** @deprecated Use TEMPLATE_VAR_KEYS with i18n labels in the UI */
export const TEMPLATE_VARS: { key: string; label: string }[] = TEMPLATE_VAR_KEYS.map((key) => ({
  key,
  label: key,
}));
