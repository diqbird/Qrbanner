'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { translate, type Locale, LOCALE_STORAGE_KEY } from '@/lib/i18n';
import { localizePath, parseLocalePath } from '@/lib/i18n/locale-path';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  const fromPath = parseLocalePath(window.location.pathname).locale;
  if (fromPath) return fromPath;

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'tr' || stored === 'en') return stored;
  } catch {}

  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('tr')) {
    return 'tr';
  }
  return 'en';
}

export function LanguageProvider({
  children,
  initialLocale = 'en',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(detectInitialLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const fromPath = parseLocalePath(pathname).locale;
    if (fromPath && fromPath !== locale) {
      setLocaleState(fromPath);
    }
  }, [pathname, ready, locale]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === 'tr' ? 'tr' : 'en';
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      document.cookie = `${LOCALE_STORAGE_KEY}=${locale};path=/;max-age=31536000;SameSite=Lax`;
    } catch {}
  }, [locale, ready]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      const logicalPath = parseLocalePath(pathname).pathname;
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const nextPath = `${localizePath(logicalPath, next)}${search}`;
      if (nextPath !== `${pathname}${search}`) {
        router.push(nextPath);
      }
    },
    [pathname, router]
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

/** Safe hook for components that may render outside provider during SSR edge cases */
export function useOptionalLanguage() {
  return useContext(LanguageContext);
}
