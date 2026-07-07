import { PASSWORD_MIN_LENGTH, PASSWORD_STRONG_LENGTH } from '@/lib/password-policy';

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'weak';
  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  if (password.length >= PASSWORD_STRONG_LENGTH) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  return 'strong';
}

export function validatePassword(password: string): { ok: true } | { ok: false; code: string } {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, code: 'password_too_short' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { ok: false, code: 'password_needs_letter' };
  }
  if (!/\d/.test(password)) {
    return { ok: false, code: 'password_needs_number' };
  }
  return { ok: true };
}
