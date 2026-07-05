#!/usr/bin/env npx tsx
/**
 * Plan limits vs enforcement audit (no DB required for static checks).
 * Run: npx tsx scripts/audit-plan-enforcement.ts
 */
import { PLANS, type PlanId, normalizePlanId, getPlanLimits } from '../lib/plans';
import { getPricingPlans } from '../lib/i18n/pricing-content';
import { workspaceOwnerHasSsoPlan } from '../lib/workspace-sso';
import {
  workspaceOwnerHasEnterprisePlan,
  workspaceOwnerHasResellerPlan,
} from '../lib/workspace-enterprise';
import { getAnalyticsCutoffDate } from '../lib/analytics-range';
import { isPaddleConfigured } from '../lib/paddle';

type Check = { name: string; ok: boolean; detail: string };

const checks: Check[] = [];

function record(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

const ORDER: PlanId[] = ['free', 'pro', 'business', 'agency'];

function assertMonotonic(field: keyof typeof PLANS.free, label: string) {
  for (let i = 1; i < ORDER.length; i++) {
    const prev = PLANS[ORDER[i - 1]][field];
    const curr = PLANS[ORDER[i]][field];
    if (typeof prev === 'number' && typeof curr === 'number' && curr < prev) {
      record(`limits.${label}`, false, `${ORDER[i]} (${curr}) < ${ORDER[i - 1]} (${prev})`);
      return;
    }
  }
  record(`limits.${label}`, true, 'Each tier ≥ previous tier');
}

// --- Static plan matrix ---
for (const id of ORDER) {
  const p = PLANS[id];
  record(`plan.${id}.codesActiveAfterCancel`, p.codesActiveAfterCancel === true, String(p.codesActiveAfterCancel));
  record(`plan.${id}.apiAccess`, p.apiAccess === true, String(p.apiAccess));
}

assertMonotonic('maxQrCodes', 'maxQrCodes');
assertMonotonic('maxCustomDomains', 'maxCustomDomains');
assertMonotonic('maxBulkRows', 'maxBulkRows');
assertMonotonic('maxWebhooks', 'maxWebhooks');
assertMonotonic('maxAutomations', 'maxAutomations');
assertMonotonic('maxStyleTemplates', 'maxStyleTemplates');
assertMonotonic('maxMarketplaceListings', 'maxMarketplaceListings');
assertMonotonic('maxResellerClients', 'maxResellerClients');
assertMonotonic('apiRateLimitPerMin', 'apiRateLimitPerMin');
assertMonotonic('apiMonthlyQuota', 'apiMonthlyQuota');

record(
  'plan.business.whiteLabel',
  PLANS.business.whiteLabel === true,
  `business whiteLabel=${PLANS.business.whiteLabel}`
);
record(
  'plan.agency.whiteLabel',
  PLANS.agency.whiteLabel === true,
  `agency whiteLabel=${PLANS.agency.whiteLabel}`
);

// --- Pricing page copy matches plans.ts ---
const enPlans = getPricingPlans('en', 'monthly');
for (const id of ORDER) {
  const source = PLANS[id];
  const displayed = enPlans.find((p) => p.id === id);
  if (!displayed) {
    record(`pricing.display.${id}`, false, 'Missing from getPricingPlans()');
    continue;
  }
  const features = displayed.features.join(' | ');
  record(
    `pricing.qrCount.${id}`,
    features.includes(String(source.maxQrCodes)) || features.includes(source.maxQrCodes.toLocaleString()),
    `Expected ${source.maxQrCodes} in features`
  );
  record(
    `pricing.bulk.${id}`,
    features.includes(String(source.maxBulkRows)),
    `Expected bulk ${source.maxBulkRows}`
  );
  record(
    `pricing.cancel.${id}`,
    source.codesActiveAfterCancel
      ? features.toLowerCase().includes('cancel') || features.toLowerCase().includes('active')
      : true,
    'Cancel messaging'
  );
}

// --- Helper functions ---
record('normalizePlanId.invalid', normalizePlanId('enterprise') === 'free', 'unknown → free');
record('normalizePlanId.pro', normalizePlanId('pro') === 'pro', 'pro');
record('sso.free', workspaceOwnerHasSsoPlan('free') === false, 'free blocked');
record('sso.pro', workspaceOwnerHasSsoPlan('pro') === false, 'pro blocked');
record('sso.business', workspaceOwnerHasSsoPlan('business') === true, 'business allowed');
record('sso.agency', workspaceOwnerHasSsoPlan('agency') === true, 'agency allowed');
record('enterprise.free', workspaceOwnerHasEnterprisePlan('free') === false, 'free blocked');
record('enterprise.business', workspaceOwnerHasEnterprisePlan('business') === true, 'business allowed');
record('enterprise.agency', workspaceOwnerHasEnterprisePlan('agency') === true, 'agency allowed');
record('reseller.free', workspaceOwnerHasResellerPlan('free') === false, 'free blocked');
record('reseller.business', workspaceOwnerHasResellerPlan('business') === false, 'business blocked');
record('reseller.agency', workspaceOwnerHasResellerPlan('agency') === true, 'agency allowed');
record('plan.agency.resellerClients', PLANS.agency.maxResellerClients === 100, 'agency client cap');
record('plan.free.marketplace', PLANS.free.maxMarketplaceListings === 0, 'free no marketplace');

const freeCutoff = getAnalyticsCutoffDate(90);
const bizCutoff = getAnalyticsCutoffDate(null);
record('analytics.freeCutoff', freeCutoff instanceof Date, '90-day cutoff is Date');
record('analytics.businessCutoff', bizCutoff === null, 'business unlimited → null');

// --- Enforcement map (code presence) ---
const ENFORCEMENT: { feature: string; file: string }[] = [
  { feature: 'QR create limit', file: 'app/api/qr/route.ts' },
  { feature: 'QR create API v1', file: 'app/api/v1/qr/route.ts' },
  { feature: 'Campaign batch QR', file: 'app/api/campaign/create/route.ts' },
  { feature: 'Custom domains', file: 'app/api/domains/route.ts' },
  { feature: 'Webhooks', file: 'app/api/webhooks/route.ts' },
  { feature: 'Automations', file: 'app/api/automations/route.ts' },
  { feature: 'Style templates', file: 'app/api/templates/route.ts' },
  { feature: 'Bulk CSV rows', file: 'app/api/qr/bulk/route.ts' },
  { feature: 'API auth gate', file: 'lib/api-auth.ts' },
  { feature: 'API rate limits', file: 'lib/api-rate-limit.ts' },
  { feature: 'Analytics retention', file: 'lib/analytics-range.ts' },
  { feature: 'White-label landing', file: 'app/s/[code]/route.ts' },
  { feature: 'White-label branding API', file: 'app/api/referral/route.ts' },
  { feature: 'Workspace SSO plan', file: 'app/api/workspace/members/route.ts' },
  { feature: 'Enterprise SMTP/SCIM', file: 'app/api/workspace/enterprise/route.ts' },
  { feature: 'Reseller clients', file: 'app/api/workspace/clients/route.ts' },
  { feature: 'SCIM Users API', file: 'app/api/scim/v2/Users/route.ts' },
  { feature: 'Marketplace listings', file: 'app/api/marketplace/listings/route.ts' },
  { feature: 'Admin manual plan', file: 'app/api/admin/users/route.ts' },
  { feature: 'Paddle checkout', file: 'app/api/billing/checkout/route.ts' },
];

import fs from 'fs';
import path from 'path';
const root = path.join(__dirname, '..');
for (const row of ENFORCEMENT) {
  const exists = fs.existsSync(path.join(root, row.file));
  record(`enforce.${row.feature}`, exists, row.file);
}

// --- Paddle billing note ---
const paddleOn = isPaddleConfigured();
record(
  'paddle.configured',
  true,
  paddleOn
    ? 'PADDLE_API_KEY + PRO/BUSINESS prices set — checkout may work'
    : 'Paddle not configured — paid CTAs use launch_free fallback (manual admin plan for QA)'
);

// --- Report ---
const failed = checks.filter((c) => !c.ok);
const passed = checks.filter((c) => c.ok);

console.log('\n=== QRbanner Plan Enforcement Audit ===\n');
console.log(`Passed: ${passed.length}  Failed: ${failed.length}\n`);

console.log('--- Plan limits (plans.ts) ---');
for (const id of ORDER) {
  const p = PLANS[id];
  console.log(
    `${id.padEnd(10)} QR:${p.maxQrCodes} domains:${p.maxCustomDomains} bulk:${p.maxBulkRows} hooks:${p.maxWebhooks} auto:${p.maxAutomations} tpl:${p.maxStyleTemplates} mkt:${p.maxMarketplaceListings} clients:${p.maxResellerClients} API:${p.apiRateLimitPerMin}/min ${p.apiMonthlyQuota}/mo analytics:${p.analyticsRetentionDays ?? '∞'}d`
  );
}

if (failed.length) {
  console.log('\n--- FAILURES ---');
  for (const f of failed) {
    console.log(`✗ ${f.name}: ${f.detail}`);
  }
  process.exit(1);
}

console.log('\n--- All static checks passed ---');
console.log('\nManual QA (no Paddle checkout):');
console.log('  1. Admin → Users → set plan to pro/business/agency');
console.log('  2. Settings → Plan usage — verify QR/domain meters');
console.log('  3. Create QR until limit → expect 403');
console.log('  4. Settings → Webhooks / Automations — verify plan limits');
console.log('  5. Business+ only: SSO toggle + hide Powered by');
console.log('  6. Business+ team workspace: Enterprise → SMTP / SCIM');
console.log('  7. Agency: Enterprise → client billing list');
