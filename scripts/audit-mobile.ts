#!/usr/bin/env npx tsx
/**
 * Static mobile / PWA checks (F10).
 * Run: npx tsx scripts/audit-mobile.ts
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
  'lib/mobile-auth.ts',
  'lib/mobile-serialize.ts',
  'app/api/mobile/v1/summary/route.ts',
  'app/api/mobile/v1/qr/route.ts',
  'app/api/mobile/v1/qr/[id]/route.ts',
  'public/sw.js',
  'app/manifest.ts',
  'components/pwa/pwa-install-banner.tsx',
  'app/(public)/apps/page.tsx',
  'app/.well-known/apple-app-site-association/route.ts',
  'app/.well-known/assetlinks.json/route.ts',
];

for (const f of REQUIRED_FILES) {
  record(`file.${f}`, fileExists(f), f);
}

record(
  'i18n.mobileApps.en',
  fileIncludes('lib/i18n/en.ts', 'mobileApps:'),
  'mobileApps keys in en.ts'
);

record(
  'i18n.mobileApps.tr',
  fileIncludes('lib/i18n/tr.ts', 'mobileApps:'),
  'mobileApps keys in tr.ts'
);

record(
  'dashboard.pwaBanner',
  fileIncludes('components/dashboard/dashboard-content.tsx', 'PwaInstallBanner'),
  'PWA banner wired in dashboard'
);

record(
  'footer.appsLink',
  fileIncludes('components/public-footer.tsx', '/apps'),
  'Footer links to /apps'
);

record(
  'manifest.standalone',
  fileIncludes('app/manifest.ts', "display: 'standalone'"),
  'PWA manifest display standalone'
);

record(
  'sw.register',
  fileIncludes('components/pwa/pwa-install-banner.tsx', "register('/sw.js')"),
  'Service worker registration'
);

record(
  'mobile.auth.sessionOrApiKey',
  fileIncludes('lib/mobile-auth.ts', 'authenticateApiRequest'),
  'Mobile auth supports API key'
);

const MOBILE_ROUTES = [
  'app/api/mobile/v1/summary/route.ts',
  'app/api/mobile/v1/qr/route.ts',
  'app/api/mobile/v1/qr/[id]/route.ts',
];

for (const route of MOBILE_ROUTES) {
  record(
    `mobile.${path.basename(path.dirname(route))}`,
    fileIncludes(route, 'authenticateMobileRequest'),
    route
  );
}

const failed = checks.filter((c) => !c.ok);
console.log('\n=== QRbanner Mobile Audit (F10) ===\n');
console.log(`Passed: ${checks.length - failed.length}  Failed: ${failed.length}\n`);

if (failed.length) {
  for (const f of failed) {
    console.log(`✗ ${f.name}: ${f.detail}`);
  }
  process.exit(1);
}

console.log('All mobile / PWA checks passed.\n');
process.exit(0);
