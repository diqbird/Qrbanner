#!/usr/bin/env node
/**
 * Test credentials login against local Next.js with dotenv loaded.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const base = process.env.APP_URL || 'http://127.0.0.1:3000';
const email = process.env.TEST_EMAIL || 'onur@qrbanner.com';
const password = process.env.TEST_PASSWORD || '';

if (!password) {
  console.error('TEST_PASSWORD required');
  process.exit(1);
}

function parseCookies(headers) {
  const jar = new Map();
  const list = headers.getSetCookie?.() ?? [];
  for (const h of list) {
    const part = h.split(';')[0];
    const i = part.indexOf('=');
    if (i > 0) jar.set(part.slice(0, i), part.slice(i + 1));
  }
  return jar;
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

const prisma = new PrismaClient();
try {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { password: true, emailVerified: true, totpEnabled: true },
  });
  const pwOk = user?.password ? await bcrypt.compare(password, user.password) : false;
  console.log('DB_PASSWORD_OK', pwOk);
  console.log('DB_EMAIL_VERIFIED', Boolean(user?.emailVerified));
  console.log('DB_TOTP', user?.totpEnabled);
} finally {
  await prisma.$disconnect();
}

const turnstileConfigured = Boolean(
  process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
);
console.log('TURNSTILE_CONFIGURED', turnstileConfigured);

const csrfRes = await fetch(`${base}/api/auth/csrf`);
const csrf = await csrfRes.json();
const jar = parseCookies(csrfRes.headers);

const body = new URLSearchParams({
  csrfToken: csrf.csrfToken,
  email: email.toLowerCase(),
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

const text = await signInRes.text();
console.log('SIGNIN_STATUS', signInRes.status);
console.log('SIGNIN_LOCATION', signInRes.headers.get('location'));
console.log('SIGNIN_BODY', text.slice(0, 500));
console.log('SESSION_COOKIES', [...jar.keys()].filter((k) => k.includes('session')).join(',') || 'none');
