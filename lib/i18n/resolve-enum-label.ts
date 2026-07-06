export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

/** Map a stored enum value to a localized label; falls back to the raw value. */
export function resolveEnumLabel(t: TranslateFn, baseKey: string, value: string): string {
  const key = `${baseKey}.${value}`;
  const label = t(key);
  return label === key ? value : label;
}
