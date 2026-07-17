#!/usr/bin/env npx tsx
/**
 * Static security hardening checks (F9).
 * Run: npx tsx scripts/audit-security.ts
 */
import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '..');
const checks: { name: string; ok: boolean; detail: string }[] = [];

function record(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}

function fileExists(rel: string): boolean {
  return fs.existsSync(path.join(root, rel));
}

function fileIncludes(rel: string, needle: string): boolean {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return false;
  return fs.readFileSync(full, 'utf8').includes(needle);
}

const REQUIRED_FILES = [
  'lib/turnstile.ts',
  'lib/csrf-origin.ts',
  'lib/guard-public-post.ts',
  'components/security/turnstile-field.tsx',
  'instrumentation.ts',
  'sentry.server.config.ts',
  'sentry.client.config.ts',
  'app/global-error.tsx',
  'scripts/vps-backup-database.sh',
];

for (const f of REQUIRED_FILES) {
  record(`file.${f}`, fileExists(f), f);
}

record(
  'csp.turnstile',
  fileIncludes('lib/csp.cjs', 'challenges.cloudflare.com'),
  'Turnstile allowed in CSP'
);
record(
  'csp.shared',
  fileIncludes('next.config.js', "require('./lib/csp.cjs')") &&
    fileIncludes('lib/security-headers.ts', "from './csp.cjs'"),
  'CSP builder shared by next.config + middleware'
);

const PUBLIC_ROUTES = [
  'app/api/signup/route.ts',
  'app/api/auth/forgot-password/route.ts',
  'app/api/contact/inquiry/route.ts',
];

for (const route of PUBLIC_ROUTES) {
  record(
    `guard.${path.basename(path.dirname(route))}`,
    fileIncludes(route, 'guardPublicPost'),
    route
  );
}

record(
  'leads.rateLimit',
  fileIncludes('app/api/leads/route.ts', 'checkRateLimit'),
  'Lead submissions rate limited'
);

record(
  'leads.origin',
  fileIncludes('app/api/leads/route.ts', 'assertBrowserOrigin'),
  'Lead submissions origin checked'
);

const failed = checks.filter((c) => !c.ok);
console.log('\n=== QRbanner Security Audit (F9) ===\n');
console.log(`Passed: ${checks.length - failed.length}  Failed: ${failed.length}\n`);

if (failed.length) {
  for (const f of failed) {
    console.log(`✗ ${f.name}: ${f.detail}`);
  }
  process.exit(1);
}

console.log('--- All security checks passed ---');
console.log('\nOptional env (enable when ready):');
console.log('  TURNSTILE_SECRET_KEY + NEXT_PUBLIC_TURNSTILE_SITE_KEY');
console.log('  SENTRY_DSN (+ NEXT_PUBLIC_SENTRY_DSN for client)');
console.log('  VPS: python scripts/install-vps-backup-cron.py');
