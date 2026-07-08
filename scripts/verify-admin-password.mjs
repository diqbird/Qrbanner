#!/usr/bin/env node
/**
 * Verify a password against the stored hash. Read-only diagnostic.
 * Usage: node scripts/verify-admin-password.mjs <email> <password>
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const [emailArg, passwordArg] = process.argv.slice(2);
if (!emailArg || !passwordArg) {
  console.error('Usage: node scripts/verify-admin-password.mjs <email> <password>');
  process.exit(1);
}
const email = emailArg.toLowerCase().trim();
const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });
  if (!user?.password) {
    console.log('VERIFY: no_password_or_user');
    process.exit(0);
  }
  const ok = await bcrypt.compare(passwordArg, user.password);
  console.log('VERIFY passwordLength=', passwordArg.length);
  console.log('VERIFY compareResult=', ok ? 'MATCH' : 'NO_MATCH');
} finally {
  await prisma.$disconnect();
}
