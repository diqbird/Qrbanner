/**
 * Server-side Pro checkout smoke test. Run on VPS only.
 * Creates a Stripe Checkout session for one free-plan user (does not charge).
 */
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
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

const secret = process.env.STRIPE_SECRET_KEY;
const pricePro = process.env.STRIPE_PRICE_PRO;
if (!secret?.startsWith('sk_') || !pricePro?.startsWith('price_')) {
  console.log('FAIL stripe_env');
  process.exit(1);
}

const mode = secret.startsWith('sk_live_') ? 'live' : 'test';
const stripe = new Stripe(secret);
const prisma = new PrismaClient();

try {
  const price = await stripe.prices.retrieve(pricePro);
  if (!price.active || price.unit_amount !== 999) {
    console.log('FAIL price_pro', price.id, price.active, price.unit_amount);
    process.exit(1);
  }
  console.log('OK price_pro', price.id, '$' + (price.unit_amount / 100));

  const user = await prisma.user.findFirst({
    where: { plan: 'free' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, stripeCustomerId: true, stripeSubscriptionId: true },
  });
  if (!user?.email) {
    console.log('FAIL no_free_user');
    process.exit(1);
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: pricePro, quantity: 1 }],
    success_url: 'https://qrbanner.com/settings?billing=success',
    cancel_url: 'https://qrbanner.com/pricing?billing=cancelled',
    metadata: { userId: user.id, plan: 'pro', smokeTest: 'true' },
    subscription_data: {
      metadata: { userId: user.id, plan: 'pro' },
    },
  });

  const ok = Boolean(session.url?.includes('checkout.stripe.com'));
  console.log('OK stripe_mode', mode);
  console.log('OK test_user', user.email);
  console.log(ok ? 'OK checkout_url' : 'FAIL checkout_url', session.url ?? 'missing');
  process.exit(ok ? 0 : 1);
} catch (err) {
  console.log('FAIL error', err?.message ?? err);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
