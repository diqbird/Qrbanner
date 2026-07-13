import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { hashBearerToken } from '@/lib/secret-crypto';
import { decryptTotpSecret, verifyTotpCode } from '@/lib/totp';

const RECOVERY_CODE_COUNT = 10;
/** Ambiguous I/O/0/1 omitted */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function normalizeRecoveryCode(raw: string): string {
  return raw.replace(/[\s-]/g, '').toUpperCase();
}

export function formatRecoveryCode(normalized: string): string {
  if (normalized.length === 8) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
  }
  return normalized;
}

function generateOneCode(): string {
  const bytes = crypto.randomBytes(8);
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length]!;
  }
  return out;
}

export function generateRecoveryCodes(): { plaintext: string[]; hashes: string[] } {
  const plaintext: string[] = [];
  const hashes: string[] = [];
  for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
    const code = generateOneCode();
    plaintext.push(formatRecoveryCode(code));
    hashes.push(hashBearerToken(normalizeRecoveryCode(code)));
  }
  return { plaintext, hashes };
}

export function parseStoredRecoveryHashes(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === 'string' && x.length > 0);
}

export function recoveryCodesRemaining(raw: unknown): number {
  return parseStoredRecoveryHashes(raw).length;
}

export async function consumeRecoveryCode(
  userId: string,
  rawCode: string,
  stored: unknown
): Promise<boolean> {
  const normalized = normalizeRecoveryCode(rawCode);
  if (normalized.length < 8) return false;
  const hash = hashBearerToken(normalized);
  const hashes = parseStoredRecoveryHashes(stored);
  const idx = hashes.indexOf(hash);
  if (idx === -1) return false;
  const next = [...hashes.slice(0, idx), ...hashes.slice(idx + 1)];
  await prisma.user.update({
    where: { id: userId },
    data: { totpRecoveryCodes: next },
  });
  return true;
}

/** Prefer 6-digit TOTP; otherwise try a one-time recovery code (consumed on success). */
export async function verifyTotpOrRecovery(opts: {
  userId: string;
  code: string;
  totpSecretEncrypted: string | null;
  recoveryCodes: unknown;
}): Promise<'totp' | 'recovery' | null> {
  const trimmed = opts.code.trim();
  const digitsOnly = trimmed.replace(/\s/g, '');
  if (/^\d{6}$/.test(digitsOnly)) {
    const secret = decryptTotpSecret(opts.totpSecretEncrypted);
    if (secret && verifyTotpCode(secret, digitsOnly)) return 'totp';
  }
  const ok = await consumeRecoveryCode(opts.userId, trimmed, opts.recoveryCodes);
  return ok ? 'recovery' : null;
}

/** When TOTP is enabled, require a valid authenticator or recovery code for sensitive actions. */
export async function requireMfaStepUp(
  userId: string,
  code: string | undefined | null
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true, totpSecret: true, totpRecoveryCodes: true },
  });
  if (!user?.totpEnabled) return { ok: true };

  const trimmed = (code ?? '').trim();
  if (!trimmed) return { ok: false, error: 'mfa_code_required', status: 400 };

  const verified = await verifyTotpOrRecovery({
    userId,
    code: trimmed,
    totpSecretEncrypted: user.totpSecret,
    recoveryCodes: user.totpRecoveryCodes,
  });
  if (!verified) return { ok: false, error: 'invalid_mfa_code', status: 400 };
  return { ok: true };
}

