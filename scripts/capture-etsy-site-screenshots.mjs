#!/usr/bin/env node
/**
 * Capture real QRbanner.com UI screenshots for Etsy listing composites.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'marketing', 'etsy-listing', 'captures');
const BASE = process.env.ETSY_CAPTURE_BASE ?? 'https://qrbanner.com';
const STUDIO_TOKEN = process.env.ETSY_STUDIO_TOKEN ?? 'wnPoTEqxEuK1dbPvxUUQ1d0snlD0aVOQ';

const TARGETS = [
  {
    id: 'home-hero',
    url: `${BASE}/`,
    viewport: { width: 1440, height: 900 },
    clip: { x: 0, y: 0, width: 1440, height: 820 },
    waitMs: 2500,
  },
  {
    id: 'studio-claim',
    url: `${BASE}/studio/${STUDIO_TOKEN}`,
    viewport: { width: 1280, height: 900 },
    clip: { x: 0, y: 0, width: 1280, height: 520 },
    waitMs: 3000,
  },
  {
    id: 'create-wizard',
    url: `${BASE}/qr/create`,
    viewport: { width: 1280, height: 900 },
    fullPage: false,
    waitMs: 3000,
  },
  {
    id: 'features',
    url: `${BASE}/features`,
    viewport: { width: 1440, height: 900 },
    clip: { x: 0, y: 52, width: 1440, height: 780 },
    waitMs: 2500,
  },
  {
    id: 'pricing',
    url: `${BASE}/pricing`,
    viewport: { width: 1440, height: 900 },
    clip: { x: 0, y: 52, width: 1440, height: 780 },
    waitMs: 2500,
  },
];

async function dismissCookieBanner(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("Kabul")',
    'button:has-text("Got it")',
    '[data-testid="cookie-accept"]',
  ];
  for (const sel of selectors) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 800 }).catch(() => false)) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(400);
      break;
    }
  }
}

async function capture(page, target) {
  await page.goto(target.url, { waitUntil: 'networkidle', timeout: 90000 });
  await dismissCookieBanner(page);
  await page.waitForTimeout(target.waitMs ?? 2000);

  const outFile = path.join(OUT, `${target.id}.png`);
  const opts = { path: outFile, type: 'png' };
  if (target.clip) {
    await page.screenshot({ ...opts, clip: target.clip });
  } else if (target.fullPage) {
    await page.screenshot({ ...opts, fullPage: true });
  } else {
    await page.screenshot({ ...opts, fullPage: false });
  }
  console.log('Captured', path.relative(ROOT, outFile));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    locale: 'en-US',
    colorScheme: 'light',
  });
  const page = await context.newPage();

  for (const target of TARGETS) {
    await page.setViewportSize(target.viewport);
    try {
      await capture(page, target);
    } catch (err) {
      console.warn(`Skip ${target.id}:`, err.message);
    }
  }

  await browser.close();
  console.log('Captures →', path.relative(ROOT, OUT));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
