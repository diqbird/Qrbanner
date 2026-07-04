'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';

/** Keeps document lang in sync without forcing the root layout to read cookies. */
export function HtmlLangSync() {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
