import type {
  AutomationAction,
  AutomationCondition,
  AutomationFlowData,
  AutomationTrigger,
} from '@/lib/automation-types';
import {
  AUTOMATION_TRIGGERS,
  MAX_AUTOMATION_ACTIONS,
  MAX_AUTOMATION_CONDITIONS,
} from '@/lib/automation-types';

function safeUrl(raw: string | undefined): string {
  const value = String(raw ?? '').trim();
  if (!value) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return u.toString();
  } catch {
    return '';
  }
}

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function sanitizeCondition(raw: unknown): AutomationCondition | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Record<string, unknown>;
  const type = c.type;
  const op = c.op;
  const value = clip(String(c.value ?? ''), 80);
  if (!value) return null;
  if (type === 'country' && (op === 'eq' || op === 'neq')) {
    return { type: 'country', op, value };
  }
  if (type === 'device' && op === 'eq') {
    return { type: 'device', op: 'eq', value };
  }
  return null;
}

function sanitizeAction(raw: unknown): AutomationAction | null {
  if (!raw || typeof raw !== 'object') return null;
  const a = raw as Record<string, unknown>;
  const type = String(a.type ?? '');
  switch (type) {
    case 'slack':
    case 'discord': {
      const webhookUrl = safeUrl(a.webhookUrl as string);
      const message = clip(String(a.message ?? ''), 2000);
      if (!webhookUrl || !message) return null;
      return { type, webhookUrl, message } as AutomationAction;
    }
    case 'email': {
      const to = clip(String(a.to ?? ''), 200);
      const subject = clip(String(a.subject ?? ''), 200);
      const body = clip(String(a.body ?? ''), 4000);
      if (!to || !to.includes('@') || !subject) return null;
      return { type: 'email', to, subject, body };
    }
    case 'webhook': {
      const url = safeUrl(a.url as string);
      if (!url) return null;
      const body = a.body ? clip(String(a.body), 4000) : undefined;
      return { type: 'webhook', url, body };
    }
    default:
      return null;
  }
}

export function sanitizeAutomationFlow(raw: unknown): AutomationFlowData | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const name = clip(String(r.name ?? ''), 80);
  if (!name) return null;

  const trigger = AUTOMATION_TRIGGERS.includes(r.trigger as AutomationTrigger)
    ? (r.trigger as AutomationTrigger)
    : 'scan';

  const conditionsRaw = Array.isArray(r.conditions) ? r.conditions : [];
  const conditions: AutomationCondition[] = [];
  for (const row of conditionsRaw) {
    if (conditions.length >= MAX_AUTOMATION_CONDITIONS) break;
    const c = sanitizeCondition(row);
    if (c) conditions.push(c);
  }

  const actionsRaw = Array.isArray(r.actions) ? r.actions : [];
  const actions: AutomationAction[] = [];
  for (const row of actionsRaw) {
    if (actions.length >= MAX_AUTOMATION_ACTIONS) break;
    const a = sanitizeAction(row);
    if (a) actions.push(a);
  }

  if (!actions.length) return null;

  return {
    name,
    enabled: r.enabled !== false,
    trigger,
    qrCodeId: r.qrCodeId ? String(r.qrCodeId).slice(0, 40) : null,
    conditions,
    actions,
  };
}
