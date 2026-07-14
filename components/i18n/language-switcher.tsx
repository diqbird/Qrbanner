'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
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

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  const current = LOCALES.find((item) => item.id === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'group h-8 gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-muted-foreground',
            'hover:bg-muted/70 hover:text-foreground data-[state=open]:bg-muted/80 data-[state=open]:text-foreground',
            className,
          )}
          aria-label={t('common.languageAria')}
        >
          <Globe className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
          <span className="tabular-nums tracking-wide">{current.label}</span>
          <ChevronDown
            className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[11.5rem] rounded-xl border-border/60 bg-popover/95 p-1.5 shadow-lg backdrop-blur-md"
      >
        <div className="px-2.5 pb-1.5 pt-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {t('common.languageAria')}
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          {LOCALES.map((item) => {
            const active = locale === item.id;
            return (
              <DropdownMenuItem
                key={item.id}
                onClick={() => setLocale(item.id)}
                className={cn(
                  'cursor-pointer gap-3 rounded-lg px-2.5 py-2.5 text-sm outline-none',
                  'focus:bg-muted/80 data-[highlighted]:bg-muted/80',
                  active && 'bg-primary/10 text-foreground',
                )}
                aria-current={active ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold tracking-wide',
                    active
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border/70 bg-muted/50 text-muted-foreground',
                  )}
                >
                  {item.label}
                </span>
                <span className="min-w-0 flex-1 text-left font-medium leading-none">{item.nativeName}</span>
                <Check
                  className={cn(
                    'h-4 w-4 shrink-0 text-primary transition-opacity',
                    active ? 'opacity-100' : 'opacity-0',
                  )}
                  aria-hidden
                />
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
