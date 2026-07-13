import { prisma } from '@/lib/db';
import { sendAutomationNotification } from '@/lib/email';
import { localizeAutomationContext } from '@/lib/i18n/localize-automation-context';
import { resolveUserEmailLocale } from '@/lib/referral';
import type {
  AutomationAction,
  AutomationCondition,
  AutomationContext,
  AutomationTrigger,
} from '@/lib/automation-types';

function interpolate(template: string, ctx: AutomationContext): string {
  const vars: Record<string, string> = {
    qrName: ctx.qrName ?? '',
    shortCode: ctx.shortCode ?? '',
    country: ctx.country ?? '',
    city: ctx.city ?? '',
    device: ctx.device ?? '',
    browser: ctx.browser ?? '',
    os: ctx.os ?? '',
    email: ctx.email ?? '',
    leadName: ctx.leadName ?? '',
    leadPhone: ctx.leadPhone ?? '',
    leadMessage: ctx.leadMessage ?? '',
    ctaLabel: ctx.ctaLabel ?? '',
    scannedAt: ctx.scannedAt ?? new Date().toISOString(),
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '');
}

function matchesConditions(conditions: AutomationCondition[], ctx: AutomationContext): boolean {
  if (!conditions.length) return true;
  for (const c of conditions) {
    if (c.type === 'country') {
      const country = (ctx.country ?? '').toLowerCase();
      const value = c.value.toLowerCase();
      if (c.op === 'eq' && country !== value) return false;
      if (c.op === 'neq' && country === value) return false;
    }
    if (c.type === 'device') {
      const device = (ctx.device ?? '').toLowerCase();
      if (device !== c.value.toLowerCase()) return false;
    }
  }
  return true;
}

async function executeAction(action: AutomationAction, ctx: AutomationContext): Promise<void> {
  switch (action.type) {
    case 'slack':
    case 'discord': {
      const text = interpolate(action.message, ctx);
      const payload =
        action.type === 'discord'
          ? { content: text }
          : { text };
      const res = await fetch(action.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return;
    }
    case 'email': {
      const subject = interpolate(action.subject, ctx);
      const body = interpolate(action.body, ctx);
      const sent = await sendAutomationNotification(
        action.to,
        subject,
        body,
        ctx.workspaceId,
        ctx.locale ?? 'en',
      );
      if (!sent.sent) throw new Error('email_not_configured');
      return;
    }
    case 'webhook': {
      const defaultBody = JSON.stringify({
        event: ctx.trigger,
        qr_code_id: ctx.qrCodeId,
        qr_name: ctx.qrName,
        short_code: ctx.shortCode,
        country: ctx.country,
        city: ctx.city,
        device: ctx.device,
        email: ctx.email,
        lead_name: ctx.leadName,
        cta_label: ctx.ctaLabel,
        timestamp: ctx.scannedAt ?? new Date().toISOString(),
      });
      const body = action.body ? interpolate(action.body, ctx) : defaultBody;
      const res = await fetch(action.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'QRbanner-Automation/1.0' },
        body,
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return;
    }
    default:
      return;
  }
}

type FlowRow = {
  id: string;
  trigger: string;
  qrCodeId: string | null;
  conditions: unknown;
  actions: unknown;
};

async function runFlow(flow: FlowRow, ctx: AutomationContext): Promise<void> {
  if (flow.trigger !== ctx.trigger) return;
  if (flow.qrCodeId && flow.qrCodeId !== ctx.qrCodeId) return;

  const conditions = Array.isArray(flow.conditions) ? (flow.conditions as AutomationCondition[]) : [];
  if (!matchesConditions(conditions, ctx)) return;

  const actions = Array.isArray(flow.actions) ? (flow.actions as AutomationAction[]) : [];
  if (!actions.length) return;

  let success = true;
  let error: string | null = null;

  for (const action of actions) {
    try {
      await executeAction(action, ctx);
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : 'action_failed';
      break;
    }
  }

  await prisma.automationLog.create({
    data: {
      flowId: flow.id,
      userId: ctx.userId,
      trigger: ctx.trigger,
      success,
      error,
    },
  });
}

/** Run all enabled automation flows for a user matching the trigger context. */
export async function dispatchAutomations(ctx: AutomationContext): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { brandingSettings: true },
    });
    const locale = resolveUserEmailLocale(user?.brandingSettings);
    const localizedCtx = localizeAutomationContext(ctx, locale);

    const flows = await prisma.automationFlow.findMany({
      where: { userId: ctx.userId, enabled: true, trigger: ctx.trigger },
      take: 20,
      select: {
        id: true,
        trigger: true,
        qrCodeId: true,
        conditions: true,
        actions: true,
      },
    });
    if (!flows.length) return;

    await Promise.allSettled(flows.map((flow) => runFlow(flow, localizedCtx)));
  } catch (err) {
    console.error('[automation] dispatch', err);
  }
}

export function buildScanAutomationContext(
  qrCode: { id: string; userId: string; name: string; shortCode: string; workspaceId?: string | null },
  scan: {
    country?: string | null;
    city?: string | null;
    device?: string | null;
    browser?: string | null;
    os?: string | null;
    scanned_at: string;
  }
): AutomationContext {
  return {
    trigger: 'scan',
    userId: qrCode.userId,
    workspaceId: qrCode.workspaceId,
    qrCodeId: qrCode.id,
    qrName: qrCode.name,
    shortCode: qrCode.shortCode,
    country: scan.country,
    city: scan.city,
    device: scan.device,
    browser: scan.browser,
    os: scan.os,
    scannedAt: scan.scanned_at,
  };
}

export function buildLeadAutomationContext(
  qrCode: { id: string; userId: string; name: string; shortCode: string; workspaceId?: string | null },
  lead: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
    country?: string | null;
    city?: string | null;
    device?: string | null;
  }
): AutomationContext {
  return {
    trigger: 'lead',
    userId: qrCode.userId,
    workspaceId: qrCode.workspaceId,
    qrCodeId: qrCode.id,
    qrName: qrCode.name,
    shortCode: qrCode.shortCode,
    country: lead.country,
    city: lead.city,
    device: lead.device,
    email: lead.email,
    leadName: lead.name,
    leadPhone: lead.phone,
    leadMessage: lead.message,
    scannedAt: new Date().toISOString(),
  };
}

export function buildCtaAutomationContext(
  qrCode: { id: string; userId: string; name: string; shortCode: string; workspaceId?: string | null },
  meta: { ctaLabel?: string | null; country?: string | null; device?: string | null }
): AutomationContext {
  return {
    trigger: 'cta_click',
    userId: qrCode.userId,
    workspaceId: qrCode.workspaceId,
    qrCodeId: qrCode.id,
    qrName: qrCode.name,
    shortCode: qrCode.shortCode,
    country: meta.country,
    device: meta.device,
    ctaLabel: meta.ctaLabel,
    scannedAt: new Date().toISOString(),
  };
}

/** Run one flow with synthetic context (skips QR/condition filters). Used by Settings → Send test. */
export async function testAutomationFlow(
  userId: string,
  flowId: string,
): Promise<{ ok: true; success: boolean; error: string | null } | { ok: false; error: string }> {
  const flow = await prisma.automationFlow.findFirst({
    where: { id: flowId, userId },
    select: {
      id: true,
      trigger: true,
      qrCodeId: true,
      conditions: true,
      actions: true,
    },
  });
  if (!flow) return { ok: false, error: 'Not found' };

  const qr =
    (flow.qrCodeId
      ? await prisma.qRCode.findFirst({
          where: { id: flow.qrCodeId, userId },
          select: { id: true, userId: true, name: true, shortCode: true, workspaceId: true },
        })
      : null) ??
    (await prisma.qRCode.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, userId: true, name: true, shortCode: true, workspaceId: true },
    })) ?? {
      id: 'test_qr_id',
      userId,
      name: 'Automation test',
      shortCode: 'test01',
      workspaceId: null as string | null,
    };

  const now = new Date().toISOString();
  let ctx: AutomationContext;
  if (flow.trigger === 'lead') {
    ctx = buildLeadAutomationContext(qr, {
      name: 'Alex Example',
      email: 'alex@example.com',
      phone: '+15550100',
      message: 'Automation test lead',
      country: 'US',
      city: 'San Francisco',
      device: 'mobile',
    });
  } else if (flow.trigger === 'cta_click') {
    ctx = buildCtaAutomationContext(qr, {
      ctaLabel: 'Order online',
      country: 'US',
      device: 'mobile',
    });
  } else {
    ctx = buildScanAutomationContext(qr, {
      country: 'US',
      city: 'San Francisco',
      device: 'desktop',
      browser: 'Chrome',
      os: 'macOS',
      scanned_at: now,
    });
  }

  // Force match to this flow's QR filter when set
  if (flow.qrCodeId) ctx.qrCodeId = flow.qrCodeId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { brandingSettings: true },
  });
  const locale = resolveUserEmailLocale(user?.brandingSettings);
  const localizedCtx = localizeAutomationContext(ctx, locale);

  const actions = Array.isArray(flow.actions) ? (flow.actions as AutomationAction[]) : [];
  if (!actions.length) {
    return { ok: true, success: false, error: 'No actions configured' };
  }

  let success = true;
  let error: string | null = null;
  for (const action of actions) {
    try {
      await executeAction(action, localizedCtx);
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : 'action_failed';
      break;
    }
  }

  await prisma.automationLog.create({
    data: {
      flowId: flow.id,
      userId,
      trigger: `${flow.trigger}.test`,
      success,
      error,
    },
  });

  return { ok: true, success, error };
}
