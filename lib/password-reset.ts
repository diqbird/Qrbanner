import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const RESET_CODE_TTL_MS = 15 * 60 * 1000;

export function createPasswordResetToken(): { token: string; tokenHash: string; expiry: Date } {
  const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('base64url');
  const tokenHash = hashPasswordResetToken(token);
  return {
    token,
    tokenHash,
    expiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  };
}

export function hashPasswordResetToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * Generates a 6-digit numeric reset code. The stored hash is bound to the
 * user's email so a short code can only be redeemed against that account,
 * which (combined with rate limiting and a short TTL) makes brute forcing
 * infeasible.
 */
export function createPasswordResetCode(email: string): {
  code: string;
  codeHash: string;
  expiry: Date;
} {
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  return {
    code,
    codeHash: hashPasswordResetCode(email, code),
    expiry: new Date(Date.now() + RESET_CODE_TTL_MS),
  };
}

export function hashPasswordResetCode(email: string, code: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedCode = code.replace(/\D/g, '').trim();
  return crypto
    .createHash('sha256')
    .update(`${normalizedEmail}:${normalizedCode}`)
    .digest('hex');
}

export async function hashUserPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
