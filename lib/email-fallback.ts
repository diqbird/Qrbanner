/** Dev-only SMTP fallback — never log secrets or one-time codes. */
export function isDevEmailFallbackAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_EMAIL_FALLBACK === 'true';
}

export function logDevEmailSkipped(kind: string, to: string): void {
  if (!isDevEmailFallbackAllowed()) return;
  const redacted = to.replace(/^(.{2}).*(@.*)$/, '$1***$2');
  console.warn(`[email] SMTP not configured — skipped ${kind} to ${redacted}`);
}

export class EmailNotConfiguredError extends Error {
  constructor(kind: string) {
    super(`SMTP not configured — cannot send ${kind}`);
    this.name = 'EmailNotConfiguredError';
  }
}
