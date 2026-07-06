type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function resolved(t: TranslateFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

const KNOWN_ERRORS: Record<string, string> = {
  email_not_configured: 'settings.automations.errors.emailNotConfigured',
  action_failed: 'settings.automations.errors.actionFailed',
};

export function resolveAutomationLogError(t: TranslateFn, error: string | null | undefined): string | null {
  if (!error) return null;
  const key = KNOWN_ERRORS[error];
  if (key) return resolved(t, key, error);
  const httpMatch = /^HTTP (\d+)$/.exec(error);
  if (httpMatch) {
    return t('settings.automations.errors.http', { status: httpMatch[1] });
  }
  return error;
}
