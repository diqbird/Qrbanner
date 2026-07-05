/**
 * Senior QA — sequential interactive user flows.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.QA_BASE_URL || 'https://qrbanner.com').replace(/\/$/, '');
const OUT = path.join(__dirname, '..', '..', 'qa-reports', 'raw-flows.json');

function collect(page) {
  const consoleErrors = [];
  const networkFailures = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err?.message || err)));
  page.on('requestfailed', (req) => {
    networkFailures.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });
  return { consoleErrors, networkFailures };
}

async function runFlow(browser, name, fn) {
  const context = await browser.newContext({ userAgent: 'QRbanner-SeniorQA/1.0' });
  const page = await context.newPage();
  const { consoleErrors, networkFailures } = collect(page);
  const steps = [];
  let verdict = 'PASS';
  try {
    await fn(page, steps);
  } catch (e) {
    verdict = 'FAIL';
    steps.push(`ERROR: ${e?.message || e}`);
  }
  await context.close();
  if (consoleErrors.length || networkFailures.length) {
    if (verdict === 'PASS') verdict = 'WARN';
  }
  return { name, verdict, steps, consoleErrors, networkFailures };
}

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const flows = [];

  console.log('Flow 1/6: Login form validation');
  flows.push(await runFlow(browser, 'Login — empty submit', async (page, steps) => {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    steps.push('Opened /login');
    await page.locator('form button[type="submit"]').first().click();
    steps.push('Clicked submit without credentials');
    await page.waitForTimeout(1000);
    const url = page.url();
    steps.push(`Still on login: ${url.includes('/login')}`);
  }));

  console.log('Flow 2/6: Signup invalid email');
  flows.push(await runFlow(browser, 'Signup — UI reachability', async (page, steps) => {
    await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
    steps.push('Opened /signup');
    await page.fill('input[type="email"], input[name="email"]', 'not-an-email');
    steps.push('Filled invalid email');
    await page.locator('form button[type="submit"]').first().click();
    steps.push('Submitted form');
    await page.waitForTimeout(1500);
  }));

  console.log('Flow 3/6: Forgot password');
  flows.push(await runFlow(browser, 'Forgot password — submit', async (page, steps) => {
    await page.goto(`${BASE}/forgot-password`, { waitUntil: 'networkidle' });
    steps.push('Opened /forgot-password');
    const email = page.locator('input[type="email"]').first();
    if (await email.isVisible()) {
      await email.fill('qa-break@example.com');
      await page.locator('form button[type="submit"]').first().click();
      steps.push('Submitted forgot-password for qa-break@example.com');
      await page.waitForTimeout(2000);
    } else {
      steps.push('No email field visible');
    }
  }));

  console.log('Flow 4/6: Enterprise XSS probe');
  flows.push(await runFlow(browser, 'Enterprise contact — XSS probe', async (page, steps) => {
    let dialog = false;
    page.on('dialog', async (d) => { dialog = true; await d.dismiss(); });
    await page.goto(`${BASE}/enterprise`, { waitUntil: 'networkidle' });
    steps.push('Opened /enterprise');
    const name = page.locator('#inq-name');
    if (await name.isVisible()) {
      await name.fill('<img src=x onerror=alert(1)>');
      await page.fill('#inq-email', 'qa-security@example.com');
      await page.locator('form button[type="submit"]').first().click();
      steps.push('Submitted XSS payload in name field');
      await page.waitForTimeout(1500);
      steps.push(`Alert dialog fired: ${dialog}`);
      if (dialog) throw new Error('XSS dialog executed');
    } else {
      steps.push('Contact form not found');
    }
  }));

  console.log('Flow 5/6: QR create wizard');
  flows.push(await runFlow(browser, 'QR create — load wizard', async (page, steps) => {
    await page.goto(`${BASE}/qr/create`, { waitUntil: 'networkidle' });
    steps.push('Opened /qr/create');
    const h1 = await page.locator('h1').first().textContent();
    steps.push(`H1: ${h1?.trim()}`);
    await page.waitForTimeout(1000);
  }));

  console.log('Flow 6/6: Pricing CTA');
  flows.push(await runFlow(browser, 'Pricing — page + CTA', async (page, steps) => {
    await page.goto(`${BASE}/pricing`, { waitUntil: 'networkidle' });
    steps.push('Opened /pricing');
    const signup = page.getByRole('link', { name: /sign up|kayıt|get started|başla/i }).first();
    if (await signup.isVisible().catch(() => false)) {
      steps.push('Signup CTA visible');
    } else {
      steps.push('Signup CTA not found by role');
    }
  }));

  await browser.close();
  const payload = { base: BASE, testedAt: new Date().toISOString(), flows };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
