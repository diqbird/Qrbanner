#!/usr/bin/env node
import 'dotenv/config';

const keys = [
  'NEXTAUTH_URL',
  'TURNSTILE_SECRET_KEY',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  'REDIS_URL',
];
for (const k of keys) {
  const v = process.env[k];
  console.log(k, v ? (k.includes('SECRET') || k.includes('REDIS') ? 'set' : v) : 'MISSING');
}

const turnstileConfigured = Boolean(
  process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
);
console.log('TURNSTILE_RUNTIME_CONFIGURED', turnstileConfigured);

// Check if built client bundle references turnstile site key
const fs = await import('fs');
const path = await import('path');
const nextDir = path.join(process.cwd(), '.next');
let foundInBuild = false;
function scan(dir, depth = 0) {
  if (depth > 4 || foundInBuild) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) scan(p, depth + 1);
    else if (ent.name.endsWith('.js') && ent.name.includes('login')) {
      const txt = fs.readFileSync(p, 'utf8');
      if (txt.includes('TURNSTILE') || txt.includes('turnstile') || txt.includes('challenges.cloudflare')) {
        foundInBuild = true;
        console.log('TURNSTILE_IN_CHUNK', p.replace(process.cwd(), ''));
      }
    }
  }
}
if (fs.existsSync(nextDir)) scan(nextDir);
