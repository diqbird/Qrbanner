#!/usr/bin/env node
import 'dotenv/config';

const email = process.env.TEST_EMAIL || 'onur@qrbanner.com';
const password = process.env.TEST_PASSWORD || '';
if (!password) {
  console.error('TEST_PASSWORD required');
  process.exit(1);
}

const jar = new Map();

function storeCookies(res) {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(';');
    const i = pair.indexOf('=');
    if (i > 0) jar.set(pair.slice(0, i), pair.slice(i + 1));
  }
}

function cookieStr() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

const csrfRes = await fetch('https://qrbanner.com/api/auth/csrf');
storeCookies(csrfRes);
const csrfJson = await csrfRes.json();
console.log('CSRF_HTTP', csrfRes.status);
console.log('CSRF_COOKIES', [...jar.keys()].join(','));

const body = new URLSearchParams({
  csrfToken: csrfJson.csrfToken,
  email,
  password,
  rememberMe: 'true',
  redirect: 'false',
  json: 'true',
});

const loginRes = await fetch('https://qrbanner.com/api/auth/callback/credentials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Cookie: cookieStr(),
  },
  body,
  redirect: 'manual',
});
storeCookies(loginRes);
const loginText = await loginRes.text();
console.log('LOGIN_HTTP', loginRes.status);
console.log('LOGIN_BODY', loginText.slice(0, 300));
console.log('LOGIN_COOKIES', [...jar.keys()].filter((k) => k.includes('session')).join(',') || 'none');

const sessionRes = await fetch('https://qrbanner.com/api/auth/session', {
  headers: { Cookie: cookieStr() },
});
const sessionText = await sessionRes.text();
console.log('SESSION_HTTP', sessionRes.status);
console.log('SESSION_BODY', sessionText.slice(0, 300));
