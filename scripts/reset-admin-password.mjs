#!/usr/bin/env node
/**
 * Reset admin password without bumping sessionVersion (avoids invalidating fresh logins).
 * Usage: node scripts/reset-admin-password.mjs <email> <password>
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const [emailArg, passwordArg] = process.argv.slice(2);
if (!emailArg || !passwordArg) {
  console.error('Usage: node scripts/reset-admin-password.mjs <email> <password>');
  process.exit(1);
}

const email = emailArg.toLowerCase().trim();
const prisma = new PrismaClient();

try {
  const hash = await bcrypt.hash(passwordArg, 12);
  const user = await prisma.user.update({
    where: { email },
    data: {
      password: hash,
      role: 'admin',
      emailVerified: new Date(),
    },
    select: { id: true, email: true, role: true, sessionVersion: true },
  });
  console.log('RESET_OK', user.email, 'sessionVersion=', user.sessionVersion);
} catch (e) {
  console.error('RESET_FAIL', e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
