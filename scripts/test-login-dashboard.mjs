#!/usr/bin/env node
/**
 * End-to-end login + dashboard smoke test against local app instance.
 */
const base = process.env.APP_URL || 'http://127.0.0.1:3000';
const email = process.env.TEST_EMAIL || 'onur@qrbanner.com';
const password = process.env.TEST_PASSWORD || '';

if (!password) {
  console.error('TEST_PASSWORD required');
  process.exit(1);
}

function parseCookies(setCookieHeaders) {
  const jar = new Map();
  for (const h of setCookieHeaders) {
    const part = h.split(';')[0];
    const i = part.indexOf('=');
    if (i > 0) jar.set(part.slice(0, i), part.slice(i + 1));
  }
  return jar;
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

async function main() {
  const csrfRes = await fetch(`${base}/api/auth/csrf`);
  const csrfJson = await csrfRes.json();
  const jar = parseCookies(csrfRes.headers.getSetCookie?.() ?? []);

  const body = new URLSearchParams({
    csrfToken: csrfJson.csrfToken,
    email,
    password,
    rememberMe: 'true',
    callbackUrl: '/dashboard',
    json: 'true',
  });

  const signInRes = await fetch(`${base}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookieHeader(jar),
    },
    body,
    redirect: 'manual',
  });

  for (const h of signInRes.headers.getSetCookie?.() ?? []) {
    const part = h.split(';')[0];
    const i = part.indexOf('=');
    if (i > 0) jar.set(part.slice(0, i), part.slice(i + 1));
  }

  console.log('SIGNIN status=', signInRes.status);
  console.log('SIGNIN location=', signInRes.headers.get('location'));
  console.log('COOKIES', [...jar.keys()].join(','));

  const dashRes = await fetch(`${base}/dashboard`, {
    headers: { Cookie: cookieHeader(jar) },
    redirect: 'manual',
  });
  const dashHtml = await dashRes.text();
  console.log('DASHBOARD status=', dashRes.status);
  console.log('DASHBOARD location=', dashRes.headers.get('location'));
  console.log('DASHBOARD hasErrorTitle=', dashHtml.includes('Something went wrong'));
  console.log('DASHBOARD hasDashboardTitle=', dashHtml.includes('Dashboard') || dashHtml.includes('dashboard'));
  console.log('DASHBOARD htmlLen=', dashHtml.length);

  const sessionRes = await fetch(`${base}/api/auth/session`, {
    headers: { Cookie: cookieHeader(jar) },
  });
  const session = await sessionRes.json();
  console.log('SESSION', JSON.stringify(session));
}

main().catch((e) => {
  console.error('FAIL', e);
  process.exit(1);
});
