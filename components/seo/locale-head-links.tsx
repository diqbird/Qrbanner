import { headers } from 'next/headers';
import { getServerLocale } from '@/lib/i18n/server';
import { PATHNAME_HEADER, parseLocalePath } from '@/lib/i18n/locale-path';
import { hreflangAlternatesForLocale } from '@/lib/seo';

/** Explicit hreflang link tags — complements Next.js metadata alternates. */
export async function LocaleHeadLinks() {
  const headerStore = await headers();
  const rawPath = headerStore.get(PATHNAME_HEADER) ?? '/';
  const { pathname } = parseLocalePath(rawPath);
  const locale = await getServerLocale();
  const alternates = hreflangAlternatesForLocale(pathname, locale);
  const languages = alternates?.languages;

  if (!languages || typeof languages !== 'object') return null;

  return (
    <>
      {Object.entries(languages).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={String(url)} />
      ))}
    </>
  );
}
