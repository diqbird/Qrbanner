/** Map API `error` codes to translated user-facing messages. */
export function resolveApiError(
  t: (key: string, vars?: Record<string, string | number>) => string,
  code: string | undefined | null,
  fallbackKey = 'auth.somethingWrong',
  vars?: Record<string, string | number>
): string {
  if (!code) return t(fallbackKey);
  const key = `auth.errors.${code}`;
  const translated = t(key, vars);
  if (translated !== key) return translated;
  return t(fallbackKey);
}
