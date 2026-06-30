'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export function ThemeModeSwitch({ className }: { className?: string }) {
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
      aria-label="Appearance"
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
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
