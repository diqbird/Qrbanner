#!/usr/bin/env node
/**
 * Run Lighthouse against production or PLAYWRIGHT_BASE_URL.
 * Usage: node scripts/lighthouse-audit.mjs [baseUrl]
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const base = (process.argv[2] ?? process.env.PLAYWRIGHT_BASE_URL ?? 'https://qrbanner.com').replace(
  /\/$/,
  '',
);

/** Paths audited; noIndex pages skip SEO gate (intentionally not indexed). */
const AUDIT_TARGETS = [
  { path: '', label: 'home' },
  { path: '/qr/create', label: 'qr-create', skipSeo: true },
  { path: '/pricing', label: 'pricing' },
];

const DEFAULT_THRESHOLDS = {
  performance: 50,
  accessibility: 80,
  bestPractices: 80,
  seo: 80,
};

const outDir = path.join(process.cwd(), '.lighthouse');
await mkdir(outDir, { recursive: true });

const chromePath = process.env.CHROME_PATH || process.env.CHROME_BIN || '';

function runLighthouse(url) {
  return new Promise((resolve, reject) => {
    const slug = url.replace(/^https?:\/\//, '').replace(/[/?#]/g, '_') || 'home';
    const out = path.join(outDir, `${slug}.json`);
    const args = [
      url,
      '--quiet',
      '--preset=desktop',
      '--max-wait-for-load=120000',
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=1350,940',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json',
      `--output-path=${out}`,
    ];
    if (chromePath) args.splice(1, 0, `--chrome-path=${chromePath}`);
    const child = spawn('npx', ['lighthouse', ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      env: process.env,
    });
    let stderr = '';
    child.stderr.on('data', (d) => {
      stderr += d;
    });
    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`Lighthouse failed for ${url}: ${stderr}`));
      else resolve(out);
    });
  });
}

function checkThresholds(row) {
  const failures = [];
  if (row.performance < DEFAULT_THRESHOLDS.performance) failures.push('performance');
  if (row.accessibility < DEFAULT_THRESHOLDS.accessibility) failures.push('accessibility');
  if (row.bestPractices < DEFAULT_THRESHOLDS.bestPractices) failures.push('bestPractices');
  if (!row.skipSeo && row.seo < DEFAULT_THRESHOLDS.seo) failures.push('seo');
  return failures;
}

const summary = [];

for (const target of AUDIT_TARGETS) {
  const url = `${base}${target.path}`;
  console.log(`Auditing ${url}...`);
  try {
    const file = await runLighthouse(url);
    const { default: fs } = await import('node:fs/promises');
    const raw = await fs.readFile(file, 'utf8');
    const report = JSON.parse(raw);
    const cats = report.categories ?? {};
    const row = {
      url,
      label: target.label,
      skipSeo: Boolean(target.skipSeo),
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
    };
    row.failures = checkThresholds(row);
    summary.push(row);
    const seoNote = row.skipSeo ? ` seo=${row.seo} (skipped gate — noindex)` : ` seo=${row.seo}`;
    console.log(
      `  perf=${row.performance} a11y=${row.accessibility} bp=${row.bestPractices}${seoNote}`,
    );
  } catch (err) {
    console.error(String(err));
    summary.push({ url, label: target.label, error: String(err) });
  }
}

await writeFile(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(`Wrote ${path.join(outDir, 'summary.json')}`);

const failed = summary.filter((r) => r.error || (r.failures && r.failures.length > 0));

if (process.env.CI && failed.length) {
  console.error('Lighthouse thresholds not met:');
  for (const r of failed) {
    if (r.error) console.error(`  ${r.url}: ${r.error}`);
    else console.error(`  ${r.url}: failed [${r.failures.join(', ')}]`);
  }
  process.exit(1);
}
