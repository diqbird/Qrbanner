import jwt from 'jsonwebtoken';

const MFA_PROOF_PURPOSE = 'mfa-step-up';
const MFA_PROOF_TTL_SEC = 120;

export function createMfaProofToken(userId: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not configured');
  return jwt.sign({ userId, purpose: MFA_PROOF_PURPOSE }, secret, {
    expiresIn: MFA_PROOF_TTL_SEC,
  });
}

export function verifyMfaProofToken(token: string, userId: string): boolean {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return false;
  try {
    const payload = jwt.verify(token, secret) as { userId?: string; purpose?: string };
    return payload.purpose === MFA_PROOF_PURPOSE && payload.userId === userId;
  } catch {
    return false;
  }
}
