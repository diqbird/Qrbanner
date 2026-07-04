/**
 * Server-side Paddle Pro checkout smoke test. Run on VPS only.
 * Creates a Paddle transaction checkout URL (does not complete payment).
 */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

function loadEnv() {
  const content = fs.readFileSync('.env', 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] = v;
  }
}

loadEnv();

const apiKey = process.env.PADDLE_API_KEY;
const pricePro = process.env.PADDLE_PRICE_PRO;
const env = process.env.PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production';
const base =
  env === 'sandbox' ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';

if (!apiKey?.startsWith('pdl_') || !pricePro?.startsWith('pri_')) {
  console.log('FAIL paddle_env');
  process.exit(1);
}

const prisma = new PrismaClient();

async function paddle(path, init = {}) {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.detail ?? JSON.stringify(json));
  }
  return json.data;
}

try {
  const price = await paddle(`/prices/${pricePro}`);
  if (!price?.id) {
    console.log('FAIL price_pro', pricePro);
    process.exit(1);
  }
  console.log('OK price_pro', price.id, price.unit_price?.amount ?? price.unit_price);

  const user = await prisma.user.findFirst({
    where: { plan: 'free' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, paddleCustomerId: true },
  });
  if (!user?.email) {
    console.log('FAIL no_free_user');
    process.exit(1);
  }

  let customerId = user.paddleCustomerId;
  if (!customerId) {
    const customer = await paddle('/customers', {
      method: 'POST',
      body: JSON.stringify({
        email: user.email,
        name: user.name ?? undefined,
        custom_data: { userId: user.id },
      }),
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { paddleCustomerId: customerId },
    });
  }

  const tx = await paddle('/transactions', {
    method: 'POST',
    body: JSON.stringify({
      items: [{ price_id: pricePro, quantity: 1 }],
      customer_id: customerId,
      custom_data: { userId: user.id, plan: 'pro', smokeTest: 'true' },
      collection_mode: 'automatic',
      checkout: { url: 'https://qrbanner.com/pay' },
    }),
  });

  const url = tx?.checkout?.url ?? '';
  // Paddle Billing (v2) returns an overlay-checkout URL on our own domain with a
  // `_ptxn=txn_...` param that Paddle.js uses to open the inline checkout.
  const ok = Boolean(
    url &&
      (url.includes('paddle.com') ||
        url.includes('pay.paddle') ||
        url.includes('_ptxn=txn_')),
  );
  console.log('OK paddle_mode', env);
  console.log('OK test_user', user.email);
  console.log(ok ? 'OK checkout_url' : 'FAIL checkout_url', url || 'missing');
  process.exit(ok ? 0 : 1);
} catch (err) {
  console.log('FAIL error', err?.message ?? err);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
