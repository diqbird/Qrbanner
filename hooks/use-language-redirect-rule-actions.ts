'use client';

import { useCallback } from 'react';
import type { LanguageRedirectData } from '@/lib/language-redirect';
import { MAX_LANGUAGE_REDIRECT_RULES } from '@/lib/language-redirect';

export function useLanguageRedirectRuleActions(
  data: LanguageRedirectData,
  onChange: (v: LanguageRedirectData) => void
) {
  const addRule = useCallback(() => {
    if (data.rules.length >= MAX_LANGUAGE_REDIRECT_RULES) return;
    onChange({
      rules: [
        ...data.rules,
        {
          id: `lang-${Date.now()}`,
          language: 'en',
          url: '',
          label: '',
        },
      ],
    });
  }, [data.rules, onChange]);

  const updateRule = useCallback(
    (id: string, patch: Partial<LanguageRedirectData['rules'][0]>) => {
      onChange({
        rules: data.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      });
    },
    [data.rules, onChange]
  );

  const removeRule = useCallback(
    (id: string) => {
      onChange({ rules: data.rules.filter((r) => r.id !== id) });
    },
    [data.rules, onChange]
  );

  return { addRule, updateRule, removeRule };
}
