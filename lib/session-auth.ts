import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';

export type SessionContext = {
  userId: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  mfaVerified?: boolean;
};

export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function getAuthSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export async function getSessionContext(): Promise<SessionContext | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as { id?: string }).id;
  if (!userId) return null;
  return {
    userId,
    name: session.user.name,
    email: session.user.email,
    role: (session.user as { role?: string }).role,
    mfaVerified: (session as { mfaVerified?: boolean }).mfaVerified,
  };
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/** Returns userId or a 401 NextResponse — use with isAuthError(). */
export async function requireUserId(): Promise<string | NextResponse> {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();
  return userId;
}

export async function requireSessionContext(): Promise<SessionContext | NextResponse> {
  const ctx = await getSessionContext();
  if (!ctx) return unauthorized();
  return ctx;
}

export function isAuthError(
  value: string | NextResponse | SessionContext
): value is NextResponse {
  return typeof value !== 'string' && 'status' in value;
}

export function isSessionContext(
  value: string | NextResponse | SessionContext
): value is SessionContext {
  return typeof value === 'object' && value !== null && 'userId' in value && !('status' in value);
}
