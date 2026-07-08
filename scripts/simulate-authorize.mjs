#!/usr/bin/env node
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const email = (process.argv[2] || 'onur@qrbanner.com').toLowerCase().trim();
const password = process.argv[3] || '';
const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      password: true,
      emailVerified: true,
      totpEnabled: true,
    },
  });
  if (!user) {
    console.log('RESULT user_not_found');
    process.exit(0);
  }

  const members = await prisma.workspaceMember.findMany({
    where: { email, status: 'active', workspace: { isPersonal: false, ssoEnabled: true } },
    select: { workspace: { select: { name: true } } },
  });
  console.log('SSO_BLOCK', members.length > 0);

  if (!user.password) console.log('RESULT no_password');
  const pw = user.password ? await bcrypt.compare(password, user.password) : false;
  console.log('PASSWORD_OK', pw);
  console.log('EMAIL_VERIFIED', Boolean(user.emailVerified));
  console.log('TOTP', user.totpEnabled);
  console.log('ROLE', user.role);

  if (!pw) console.log('RESULT invalid_credentials');
  else if (!user.emailVerified) console.log('RESULT email_not_verified');
  else if (members.length) console.log('RESULT sso_required');
  else console.log('RESULT would_authorize_ok');
} finally {
  await prisma.$disconnect();
}
