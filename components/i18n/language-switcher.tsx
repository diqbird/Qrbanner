'use client';

import { Check, ChevronDown, Globe2 } from 'lucide-react';
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
            'group relative h-8 gap-1.5 rounded-sm px-2.5 text-[13px] font-medium tracking-tight',
            'border border-transparent text-[var(--jt-ink,currentColor)]/75',
            'hover:border-[var(--jt-rule,#D6CFC0)] hover:bg-[var(--jt-ink,#1C1917)]/[0.06] hover:text-[var(--jt-ink,#1C1917)]',
            'data-[state=open]:border-[var(--jt-rule,#D6CFC0)] data-[state=open]:bg-[var(--jt-ink,#1C1917)]/[0.08]',
            'transition-colors duration-200',
            className,
          )}
          aria-label={t('common.languageAria')}
        >
          <Globe2 className="h-3.5 w-3.5 opacity-70" aria-hidden />
          <span className="font-semibold tabular-nums">{current.label}</span>
          <ChevronDown
            className="h-3 w-3 opacity-50 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        collisionPadding={12}
        className="z-[60] w-[220px] p-2"
      >
        <div className="mb-1.5 px-2.5 pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t('common.languageAria')}
          </p>
        </div>
        <div className="flex flex-col gap-1" style={{ transformStyle: 'preserve-3d' }}>
          {LOCALES.map((item, index) => {
            const active = locale === item.id;
            return (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => setLocale(item.id)}
                className={cn(
                  'menu-item-3d cursor-pointer gap-3 rounded-xl px-2.5 py-2.5',
                  'border border-transparent',
                  'focus:bg-foreground/[0.06] data-[highlighted]:bg-foreground/[0.06]',
                  active &&
                    'border-white/25 bg-foreground/[0.07] shadow-[0_10px_24px_-16px_rgba(0,0,0,0.5)] dark:border-white/15',
                  compact && 'py-2',
                )}
                style={{ animationDelay: `${index * 35}ms` }}
                aria-current={active ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold tracking-wide',
                    'border shadow-[0_8px_18px_-12px_rgba(0,0,0,0.55)]',
                    active
                      ? 'border-primary/35 bg-primary text-primary-foreground'
                      : 'border-white/25 bg-muted/70 text-muted-foreground dark:border-white/10',
                  )}
                >
                  {item.label}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-semibold leading-none tracking-tight">{item.nativeName}</span>
                  <span className="mt-1 block text-[11px] leading-none text-muted-foreground">
                    {item.label}
                  </span>
                </span>
                <Check
                  className={cn(
                    'h-4 w-4 shrink-0 stroke-[2.5] text-primary transition-all duration-150',
                    active ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
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
