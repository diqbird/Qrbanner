#!/usr/bin/env node
/**
 * Diagnose why an account cannot log in. Read-only.
 * Usage: node scripts/diag-admin-login.mjs email@example.com
 */
import { PrismaClient } from '@prisma/client';

const [emailArg] = process.argv.slice(2);
if (!emailArg) {
  console.error('Usage: node scripts/diag-admin-login.mjs <email>');
  process.exit(1);
}
const email = emailArg.toLowerCase().trim();
const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      emailVerified: true,
      password: true,
      totpEnabled: true,
      sessionVersion: true,
      createdAt: true,
    },
  });

  if (!user) {
    console.log('DIAG: user_not_found for', email);
    process.exit(0);
  }

  console.log('DIAG id=', user.id);
  console.log('DIAG role=', user.role);
  console.log('DIAG emailVerified=', user.emailVerified ? 'yes' : 'NO');
  console.log('DIAG hasPassword=', user.password ? 'yes' : 'NO');
  console.log('DIAG passwordHashPrefix=', user.password ? user.password.slice(0, 7) : 'none');
  console.log('DIAG totpEnabled=', user.totpEnabled);
  console.log('DIAG sessionVersion=', user.sessionVersion);

  // SSO policy check for this email domain
  const domain = email.split('@')[1];
  const wsWithDomain = await prisma.workspace.findMany({
    where: { ssoEnabled: true },
    select: { name: true, ssoProvider: true, allowedDomains: true },
  });
  const blocking = wsWithDomain.filter((w) => {
    const domains = Array.isArray(w.allowedDomains) ? w.allowedDomains.map((d) => String(d).toLowerCase()) : [];
    return domains.some((d) => domain === d || domain.endsWith('.' + d));
  });
  console.log('DIAG ssoWorkspacesEnforcingDomain=', blocking.length);
  console.log('DIAG turnstileConfigured=', Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY));
} finally {
  await prisma.$disconnect();
}
