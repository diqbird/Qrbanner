import { cookies, headers } from 'next/headers';
import { translate, type Locale } from '@/lib/i18n';
import { LOCALE_HEADER } from '@/lib/i18n/locale-path';
import { LOCALE_STORAGE_KEY, isLocale } from '@/lib/i18n/types';

export async function getServerLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(LOCALE_HEADER);
  if (isLocale(fromHeader)) return fromHeader;

  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_STORAGE_KEY)?.value;
  return isLocale(value) ? value : 'en';
}

export async function serverT(
  key: string,
  vars?: Record<string, string | number>
): Promise<string> {
  const locale = await getServerLocale();
  return translate(locale, key, vars);
}
