'use client';

import { LOCALES } from '@/lib/i18n';
import { useLanguage } from './language-provider';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs font-medium',
        className
      )}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setLocale(item.id)}
          className={cn(
            'rounded-md px-2.5 py-1 transition-colors',
            locale === item.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={locale === item.id}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
