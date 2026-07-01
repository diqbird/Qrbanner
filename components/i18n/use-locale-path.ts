'use client';

import { useCallback } from 'react';
import { localizePath } from '@/lib/i18n/locale-path';
import { useLanguage } from './language-provider';

export function useLocalePath() {
  const { locale } = useLanguage();
  return useCallback((path: string) => localizePath(path, locale), [locale]);
}
