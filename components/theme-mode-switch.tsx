'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/i18n/language-provider';

const modes = [
  { value: 'light', labelKey: 'settings.appearanceLight', icon: Sun },
  { value: 'dark', labelKey: 'settings.appearanceDark', icon: Moon },
  { value: 'system', labelKey: 'settings.appearanceSystem', icon: Monitor },
] as const;

export function ThemeModeSwitch({ className }: { className?: string }) {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={cn('grid h-10 grid-cols-3 gap-1 rounded-lg bg-muted p-1', className)}>
        {modes.map((m) => (
          <div key={m.value} className="h-8 rounded-md bg-background/50" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('grid grid-cols-3 gap-1 rounded-lg bg-muted p-1', className)}
      role="radiogroup"
      aria-label={t('settings.appearance')}
    >
      {modes.map((mode) => {
        const active = theme === mode.value;
        return (
          <button
            key={mode.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(mode.value)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <mode.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t(mode.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
