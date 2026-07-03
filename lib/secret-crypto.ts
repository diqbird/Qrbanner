import crypto from 'crypto';

function getEncryptionKey(scope: string): Buffer {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not configured');
  return crypto.createHash('sha256').update(`${scope}:${secret}`).digest();
}

export function encryptSecret(plain: string, scope = 'app-secret'): string {
  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey(scope);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${tag.toString('base64')}:${enc.toString('base64')}`;
}

export function decryptSecret(stored: string | null | undefined, scope = 'app-secret'): string | null {
  if (!stored) return null;
  try {
    const [ivB64, tagB64, dataB64] = stored.split(':');
    if (!ivB64 || !tagB64 || !dataB64) return null;
    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');
    const key = getEncryptionKey(scope);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(data), decipher.final()]);
    return plain.toString('utf8');
  } catch {
    return null;
  }
}

export function hashBearerToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
