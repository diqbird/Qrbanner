'use client';

import { Check, ChevronDown } from 'lucide-react';
import { LOCALES } from '@/lib/i18n';
import { useLanguage } from './language-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type LanguageSwitcherProps = {
  className?: string;
  /** denser layout for tight header chrome */
  compact?: boolean;
};

export function LanguageSwitcher({ className, compact = true }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();
  const current = LOCALES.find((item) => item.id === locale) ?? LOCALES[0];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'group relative h-8 rounded-full px-2.5 text-[13px] font-medium tracking-tight text-foreground/70',
            'hover:bg-foreground/[0.06] hover:text-foreground',
            'focus-visible:ring-1 focus-visible:ring-foreground/20',
            'data-[state=open]:bg-foreground/[0.08] data-[state=open]:text-foreground',
            className,
          )}
          aria-label={t('common.languageAria')}
        >
          <span className="inline-flex items-center gap-1">
            <span className="font-medium tabular-nums">{current.label}</span>
            <ChevronDown
              className="h-3 w-3 opacity-50 transition-transform duration-150 ease-out group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        collisionPadding={12}
        className={cn(
          'z-[60] w-[200px] overflow-hidden rounded-2xl border border-black/8 bg-white p-1.5',
          'shadow-[0_12px_40px_-12px_rgba(0,0,0,0.28),0_0_0_1px_rgba(0,0,0,0.04)]',
          'dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)]',
          'animate-in fade-in-0 zoom-in-95 duration-150',
        )}
      >
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0" role="none">
          {LOCALES.map((item) => {
            const active = locale === item.id;
            return (
              <li key={item.id} className="m-0 p-0">
                <DropdownMenuItem
                  onSelect={() => setLocale(item.id)}
                  className={cn(
                    'cursor-pointer rounded-xl px-3 py-2.5 text-[13px] outline-none',
                    'flex items-center gap-3',
                    'text-foreground/80 focus:bg-zinc-100 focus:text-foreground',
                    'dark:focus:bg-white/8 data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-white/8',
                    active && 'bg-zinc-100 text-foreground dark:bg-white/10',
                    compact && 'py-2',
                  )}
                  aria-current={active ? 'true' : undefined}
                >
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block font-medium leading-none tracking-tight">{item.nativeName}</span>
                    <span className="mt-1 block text-[11px] font-normal leading-none tracking-wide text-muted-foreground">
                      {item.label}
                    </span>
                  </span>
                  <Check
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 stroke-[2.5] text-foreground transition-opacity duration-100',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden
                  />
                </DropdownMenuItem>
              </li>
            );
          })}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
