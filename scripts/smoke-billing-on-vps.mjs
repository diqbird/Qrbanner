/**
 * Server-side Paddle billing smoke test. Run on VPS only.
 * Verifies Paddle env vars and local billing status endpoint.
 */
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
const clientToken = process.env.PADDLE_CLIENT_TOKEN;
const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
const environment = process.env.PADDLE_ENVIRONMENT ?? 'production';

if (!apiKey?.startsWith('pdl_')) {
  console.log('FAIL paddle_api_key');
  process.exit(1);
}
if (!pricePro?.startsWith('pri_')) {
  console.log('FAIL paddle_price_pro');
  process.exit(1);
}

console.log('OK paddle_env', environment);
console.log('OK price_pro', pricePro);
if (clientToken) console.log('OK paddle_client_token');
else console.log('WARN no_paddle_client_token');
if (webhookSecret) console.log('OK paddle_webhook_secret');
else console.log('WARN no_paddle_webhook_secret');

const port = process.env.PORT ?? '3000';
const statusUrl = `http://127.0.0.1:${port}/api/billing/status`;

try {
  const res = await fetch(statusUrl, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    console.log('FAIL billing_status_http', res.status);
    process.exit(1);
  }
  const data = await res.json();
  if (data.provider !== 'paddle' || !data.configured) {
    console.log('FAIL billing_status', JSON.stringify(data));
    process.exit(1);
  }
  console.log('OK billing_status', 'provider=paddle configured=true');
  process.exit(0);
} catch (err) {
  console.log('FAIL billing_status_fetch', err?.message ?? err);
  process.exit(1);
}
