import { NextResponse } from 'next/server';
import { requireAdminUserId } from '@/lib/admin-auth';
import {
  isAuthError,
  requireSessionContext,
  requireUserId,
  type SessionContext,
} from '@/lib/session-auth';

export type { SessionContext };

/** Session required — returns userId or 401. */
export async function requireApiUserId(): Promise<string | NextResponse> {
  return requireUserId();
}

/** Full session context or 401. */
export async function requireApiSession(): Promise<SessionContext | NextResponse> {
  return requireSessionContext();
}

/** Admin role + MFA — returns admin userId or 403. */
export async function requireApiAdmin(): Promise<string | NextResponse> {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return adminId;
}

export { isAuthError };
