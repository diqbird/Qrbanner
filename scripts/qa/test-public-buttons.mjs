/**
 * Public-page button click audit — sequential, captures console + network.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.QA_BASE_URL || 'https://qrbanner.com').replace(/\/$/, '');
const OUT = path.join(__dirname, '..', '..', 'qa-reports', 'button-click-audit.json');

const PAGES = [
  '/',
  '/pricing',
  '/features',
  '/faq',
  '/contact',
  '/enterprise',
  '/developers',
  '/login',
  '/signup',
  '/forgot-password',
  '/qr/create',
  '/qr/campaign',
  '/templates',
  '/case-studies',
  '/customers',
  '/reviews',
  '/blog',
  '/solutions',
  '/integrations',
  '/compare',
  '/security',
  '/status',
  '/demo',
  '/referral',
  '/affiliates',
  '/privacy',
  '/terms',
  '/cookies',
  '/refund',
  '/tr',
  '/tr/pricing',
];

async function auditPage(page, pagePath) {
  const url = `${BASE}${pagePath}`;
  const consoleErrors = [];
  const apiCalls = [];
  const results = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('response', (resp) => {
    const u = resp.url();
    if (u.includes('/api/') && u.startsWith(BASE)) {
      apiCalls.push({ url: u, status: resp.status(), method: resp.request().method() });
    }
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1200);
  } catch (e) {
    return { pagePath, error: String(e?.message || e), results: [], consoleErrors, apiCalls };
  }

  const buttons = page.locator(
    'button:visible, [role="button"]:visible, a.btn:visible, header a:visible, footer a:visible'
  );
  const count = await buttons.count();
  const max = Math.min(count, 40);

  for (let i = 0; i < max; i++) {
    const btn = buttons.nth(i);
    let label = '';
    let tag = '';
    let href = null;
    try {
      label = ((await btn.innerText().catch(() => '')) || '').trim().slice(0, 60);
      tag = await btn.evaluate((el) => el.tagName.toLowerCase());
      if (tag === 'a') href = await btn.getAttribute('href');
    } catch {
      continue;
    }

    const beforeUrl = page.url();
    const beforeErrors = consoleErrors.length;
    const beforeApi = apiCalls.length;
    let clickOk = true;
    let clickError = null;
    let navigated = false;

    try {
      if (tag === 'a' && href && (href.startsWith('http') && !href.startsWith(BASE))) {
        results.push({
          index: i,
          label,
          tag,
          href,
          verdict: 'SKIP_EXTERNAL',
          navigated: false,
        });
        continue;
      }
      await btn.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => undefined);
      await btn.click({ timeout: 5000, noWaitAfter: true }).catch(async () => {
        await btn.click({ timeout: 5000, force: true });
      });
      await page.waitForTimeout(600);
      navigated = page.url() !== beforeUrl;
      if (navigated && !page.url().startsWith(BASE)) {
        await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
        navigated = false;
      } else if (navigated) {
        await page.goBack({ waitUntil: 'domcontentloaded' }).catch(async () => {
          await page.goto(url, { waitUntil: 'domcontentloaded' });
        });
      }
    } catch (e) {
      clickOk = false;
      clickError = String(e?.message || e).slice(0, 200);
    }

    const newErrors = consoleErrors.slice(beforeErrors);
    const newApis = apiCalls.slice(beforeApi);
    const failedApi = newApis.filter((a) => a.status >= 400);

    let verdict = 'PASS';
    if (!clickOk) verdict = 'FAIL_CLICK';
    else if (newErrors.some((e) => !e.includes('401') && !e.includes('404'))) verdict = 'WARN_CONSOLE';
    else if (failedApi.some((a) => a.status >= 500)) verdict = 'FAIL_API';

    results.push({
      index: i,
      label,
      tag,
      href,
      clickOk,
      clickError,
      navigated,
      verdict,
      newConsoleErrors: newErrors,
      newApiCalls: newApis,
    });
  }

  return { pagePath, url, results, consoleErrors, apiCalls };
}

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: 'ButtonAudit/1.0' });
  const page = await context.newPage();
  const report = [];

  for (let p = 0; p < PAGES.length; p++) {
    const pagePath = PAGES[p];
    process.stdout.write(`[${p + 1}/${PAGES.length}] ${pagePath} ... `);
    const r = await auditPage(page, pagePath);
    report.push(r);
    const fails = r.results?.filter((x) => x.verdict.startsWith('FAIL')).length ?? 0;
    console.log(fails ? `${fails} FAIL` : 'OK');
  }

  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify({ base: BASE, testedAt: new Date().toISOString(), pages: report }, null, 2));
  console.log(`Wrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
