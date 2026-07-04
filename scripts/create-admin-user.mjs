#!/usr/bin/env node
/**
 * Create or promote an admin user.
 * Usage: node scripts/create-admin-user.mjs email@example.com 'SecurePassword123!'
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const [emailArg, passwordArg] = process.argv.slice(2);
if (!emailArg || !passwordArg) {
  console.error('Usage: node scripts/create-admin-user.mjs <email> <password>');
  process.exit(1);
}

const email = emailArg.toLowerCase().trim();
const password = passwordArg;

if (password.length < 10) {
  console.error('Password must be at least 10 characters.');
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: email.split('@')[0],
      password: hash,
      role: 'admin',
      emailVerified: new Date(),
      sessionVersion: 0,
    },
    update: {
      password: hash,
      role: 'admin',
      emailVerified: new Date(),
      sessionVersion: { increment: 1 },
    },
    select: { id: true, email: true, role: true },
  });
  console.log('Admin user ready:', user.email, user.id);
} finally {
  await prisma.$disconnect();
}
