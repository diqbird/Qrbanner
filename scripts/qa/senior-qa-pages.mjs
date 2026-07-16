/**
 * Senior QA — sequential page audit with console + network capture.
 * One page at a time; no parallel navigation.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.QA_BASE_URL || 'https://qrbanner.com').replace(/\/$/, '');
const OUT_DIR = path.join(__dirname, '..', '..', 'qa-reports');
const RAW = path.join(OUT_DIR, 'raw-pages.json');

const CRITICAL_PAGES = [
  '/',
  '/pricing',
  '/features',
  '/faq',
  '/contact',
  '/enterprise',
  '/developers',
  '/status',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/cookies',
  '/refund',
  '/qr/create',
  '/qr/templates',
  '/case-studies',
  '/customers',
  '/reviews',
  '/blog',
  '/solutions',
  '/integrations',
  '/vs',
  '/security',
  '/dashboard',
  '/admin',
  '/this-page-does-not-exist-qa-break',
  '/tr',
  '/tr/pricing',
  '/de/pricing',
  '/es/features',
  '/case-studies/multi-location-restaurant-menus',
  '/solutions/restaurant-menu',
  '/contact?demo=1',
];

async function fetchSitemapSample(maxExtra = 25) {
  try {
    const res = await fetch(`${BASE}/sitemap.xml`);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
      try {
        return new URL(m[1]).pathname + new URL(m[1]).search;
      } catch {
        return null;
      }
    }).filter(Boolean);
    const seen = new Set(CRITICAL_PAGES);
    const extra = [];
    for (const p of locs) {
      if (seen.has(p)) continue;
      seen.add(p);
      extra.push(p);
      if (extra.length >= maxExtra) break;
    }
    return extra;
  } catch {
    return [];
  }
}

function pushUnique(list, item) {
  if (!list.includes(item)) list.push(item);
}

async function auditPage(browser, pagePath) {
  const url = pagePath.startsWith('http') ? pagePath : `${BASE}${pagePath.startsWith('/') ? '' : '/'}${pagePath}`;
  const context = await browser.newContext({
    userAgent: 'QRbanner-SeniorQA/1.0',
    ignoreHTTPSErrors: false,
  });
  const page = await context.newPage();

  const consoleLogs = [];
  const consoleErrors = [];
  const requestFailed = [];
  const responses4xx5xx = [];
  const allResponses = [];

  page.on('console', (msg) => {
    const entry = { type: msg.type(), text: msg.text() };
    consoleLogs.push(entry);
    if (msg.type() === 'error') consoleErrors.push(entry);
  });

  page.on('pageerror', (err) => {
    consoleErrors.push({ type: 'pageerror', text: String(err?.message || err) });
  });

  page.on('requestfailed', (req) => {
    requestFailed.push({
      url: req.url(),
      method: req.method(),
      failure: req.failure()?.errorText || 'unknown',
    });
  });

  page.on('response', (resp) => {
    const status = resp.status();
    const entry = { url: resp.url(), status, method: resp.request().method() };
    allResponses.push(entry);
    if (status >= 400) {
      responses4xx5xx.push(entry);
    }
  });

  let navStatus = null;
  let navError = null;
  const started = Date.now();

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 });
    navStatus = resp?.status() ?? null;
    await page.waitForTimeout(1500);
  } catch (e) {
    navError = String(e?.message || e);
  }

  const title = await page.title().catch(() => '');
  const hasHeader = await page.locator('header').first().isVisible().catch(() => false);
  const hasFooter = await page.locator('footer').first().isVisible().catch(() => false);

  const result = {
    path: pagePath,
    url,
    navStatus,
    navError,
    durationMs: Date.now() - started,
    title,
    hasHeader,
    hasFooter,
    consoleErrorCount: consoleErrors.length,
    consoleErrors,
    requestFailedCount: requestFailed.length,
    requestFailed,
    responses4xx5xxCount: responses4xx5xx.length,
    responses4xx5xx,
    totalResponses: allResponses.length,
    thirdPartyFailures: requestFailed.filter((r) => !r.url.startsWith(BASE)),
  };

  await context.close();
  return result;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const extra = await fetchSitemapSample(25);
  const pages = [...CRITICAL_PAGES];
  for (const p of extra) pushUnique(pages, p);

  console.log(`Senior QA pages: ${pages.length} URLs on ${BASE}`);
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    process.stdout.write(`[${i + 1}/${pages.length}] ${p} ... `);
    const r = await auditPage(browser, p);
    results.push(r);
    const issues = r.consoleErrorCount + r.requestFailedCount + (r.navError ? 1 : 0);
    console.log(issues > 0 ? `ISSUES(${issues})` : 'OK');
  }

  await browser.close();
  fs.writeFileSync(RAW, JSON.stringify({ base: BASE, testedAt: new Date().toISOString(), pages: results }, null, 2));
  console.log(`Wrote ${RAW}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
