/** Map API `error` codes to translated user-facing messages. */
export function resolveApiError(
  t: (key: string) => string,
  code: string | undefined | null,
  fallbackKey = 'auth.somethingWrong'
): string {
  if (!code) return t(fallbackKey);
  const key = `auth.errors.${code}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return t(fallbackKey);
}
