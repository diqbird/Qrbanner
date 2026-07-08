#!/usr/bin/env node
/**
 * Smoke test: sign in as admin and verify every admin module API responds 200.
 * Usage: TEST_EMAIL=... TEST_PASSWORD=... node scripts/smoke-admin-modules.mjs
 */
const base = process.env.APP_URL || 'https://qrbanner.com';
const email = process.env.TEST_EMAIL || 'onur@qrbanner.com';
const password = process.env.TEST_PASSWORD || '';
if (!password) {
  console.error('TEST_PASSWORD required');
  process.exit(1);
}

const jar = new Map();
function store(res) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(';');
    const i = pair.indexOf('=');
    if (i > 0) jar.set(pair.slice(0, i), pair.slice(i + 1));
  }
}
const cookies = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');

const csrfRes = await fetch(`${base}/api/auth/csrf`);
store(csrfRes);
const { csrfToken } = await csrfRes.json();

const loginRes = await fetch(`${base}/api/auth/callback/credentials`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: cookies() },
  body: new URLSearchParams({ csrfToken, email, password, redirect: 'false', json: 'true' }),
  redirect: 'manual',
});
store(loginRes);
console.log('LOGIN', loginRes.status);

const endpoints = [
  '/api/admin/stats',
  '/api/admin/health',
  '/api/admin/analytics',
  '/api/admin/workspaces',
  '/api/admin/qr',
  '/api/admin/payments',
  '/api/admin/webhooks',
  '/api/admin/menus',
  '/api/admin/campaigns',
  '/api/admin/banners',
  '/api/admin/ai',
  '/api/admin/notifications',
  '/api/admin/support',
  '/api/admin/backup',
];

let failures = 0;
for (const path of endpoints) {
  const res = await fetch(`${base}${path}`, { headers: { Cookie: cookies() } });
  const ok = res.status === 200;
  if (!ok) failures++;
  console.log(ok ? 'OK  ' : 'FAIL', res.status, path);
}
console.log(failures === 0 ? 'SMOKE_ALL_OK' : `SMOKE_FAILURES ${failures}`);
process.exit(failures === 0 ? 0 : 1);
