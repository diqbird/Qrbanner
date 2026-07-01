import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import { ensurePersonalWorkspace } from '@/lib/workspace';

export type SamlSignInTokenPayload = {
  purpose: 'saml-sso';
  userId: string;
  workspaceId: string;
};

export function createSamlSignInToken(userId: string, workspaceId: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not configured');
  return jwt.sign({ purpose: 'saml-sso', userId, workspaceId } satisfies SamlSignInTokenPayload, secret, {
    expiresIn: '5m',
  });
}

export function verifySamlSignInToken(token: string): SamlSignInTokenPayload {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not configured');
  const payload = jwt.verify(token, secret) as SamlSignInTokenPayload;
  if (payload.purpose !== 'saml-sso' || !payload.userId || !payload.workspaceId) {
    throw new Error('invalid_verify_session');
  }
  return payload;
}

export async function provisionSamlUser(params: {
  email: string;
  name: string | null;
  providerAccountId: string;
  workspaceId: string;
}): Promise<{ userId: string }> {
  const { email, name, providerAccountId, workspaceId } = params;

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: new Date(),
      },
    });
  } else {
    const updates: { emailVerified?: Date; name?: string | null } = {};
    if (!user.emailVerified) updates.emailVerified = new Date();
    if (!user.name && name) updates.name = name;
    if (Object.keys(updates).length) {
      user = await prisma.user.update({ where: { id: user.id }, data: updates });
    }
  }

  await prisma.account.upsert({
    where: {
      provider_providerAccountId: { provider: 'saml', providerAccountId },
    },
    create: {
      userId: user.id,
      type: 'oauth',
      provider: 'saml',
      providerAccountId,
    },
    update: { userId: user.id },
  });

  await prisma.workspaceMember.updateMany({
    where: { workspaceId, email, status: 'pending' },
    data: { status: 'active', userId: user.id, joinedAt: new Date() },
  });

  await ensurePersonalWorkspace(user.id);

  return { userId: user.id };
}
