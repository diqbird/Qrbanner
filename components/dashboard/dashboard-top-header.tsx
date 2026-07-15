'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, PlusCircle, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useLanguage } from '@/components/i18n/language-provider';
import { cn } from '@/lib/utils';
import type { DashboardShellState } from '@/hooks/use-dashboard-shell';

export function DashboardTopHeader({ shell }: { shell: DashboardShellState }) {
  const { t } = useLanguage();
  const { setSidebarOpen, setCommandOpen } = shell;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 lg:px-6">
      <div
        className={cn(
          'flex h-14 items-center gap-3 rounded-2xl border border-white/35 bg-card/70 px-3 backdrop-blur-2xl sm:px-4',
          'shadow-[0_18px_50px_-28px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.45)_inset]',
          'dark:border-white/10 dark:bg-card/55 dark:shadow-[0_22px_60px_-24px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.08)_inset]',
        )}
      >
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label={t('dashboard.openMenu')}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden gap-2 rounded-xl border-white/25 bg-background/40 text-muted-foreground shadow-[0_10px_24px_-16px_rgba(0,0,0,0.4)] sm:flex"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">{t('commandPalette.shortcutHint')}</span>
        </Button>
        <LanguageSwitcher />
        <ThemeToggle />
        <Link href="/qr/create?quick=1">
          <Button size="sm" className="gap-2 shrink-0 rounded-xl shadow-[0_14px_34px_-14px_hsl(var(--primary)/0.7)]">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('dashboard.newQrCode')}</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
