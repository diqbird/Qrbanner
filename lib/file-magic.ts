const SIGNATURES: Record<string, number[][]> = {
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/jpg': [[0xff, 0xd8, 0xff]],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
};

function matchesSignature(buffer: Buffer, signature: number[]): boolean {
  if (buffer.length < signature.length) return false;
  return signature.every((byte, i) => buffer[i] === byte);
}

function isWebp(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  const riff = buffer.subarray(0, 4).toString('ascii');
  const webp = buffer.subarray(8, 12).toString('ascii');
  return riff === 'RIFF' && webp === 'WEBP';
}

/** Verify image bytes match declared MIME (magic-byte check). */
export function verifyImageMagicBytes(buffer: Buffer, declaredMime: string): boolean {
  const mime = declaredMime.toLowerCase();

  if (mime === 'image/webp') {
    return isWebp(buffer);
  }

  const signatures = SIGNATURES[mime];
  if (!signatures) return false;
  return signatures.some((sig) => matchesSignature(buffer, sig));
}
