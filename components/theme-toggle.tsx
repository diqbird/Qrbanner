'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';

export function ThemeToggle() {
  const { t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-sm"
        aria-label={t('common.toggleThemeAria')}
        suppressHydrationWarning
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-8 w-8 rounded-sm text-[var(--jt-ink,currentColor)]/70 hover:bg-[var(--jt-ink,#1C1917)]/[0.06] hover:text-[var(--jt-ink,#1C1917)]"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? t('common.switchToLightAria') : t('common.switchToDarkAria')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
