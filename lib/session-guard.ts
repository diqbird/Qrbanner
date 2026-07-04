import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export type AuthenticatedSession = {
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null };
  mfaVerified?: boolean;
};

/** Returns session only when signed in and MFA step-up is complete (if required). */
export async function requireAuthenticatedSession(): Promise<AuthenticatedSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const mfaVerified = (session as { mfaVerified?: boolean }).mfaVerified;
  if (mfaVerified === false) return null;
  return session as AuthenticatedSession;
}

export function sessionUserId(session: AuthenticatedSession): string | null {
  return session.user.id ?? null;
}
