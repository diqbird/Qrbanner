import crypto from 'crypto';

export const API_KEY_PREFIX = 'qb_live_';

export function generateApiKey(): string {
  return `${API_KEY_PREFIX}${crypto.randomBytes(24).toString('base64url')}`;
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export function getApiKeyPrefix(key: string): string {
  if (key.length <= 16) return key.slice(0, 8) + '…';
  return key.slice(0, 16) + '…';
}

export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith(API_KEY_PREFIX) && key.length >= 20;
}
