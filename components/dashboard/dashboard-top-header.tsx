'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, PlusCircle, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useLanguage } from '@/components/i18n/language-provider';
import type { DashboardShellState } from '@/hooks/use-dashboard-shell';

export function DashboardTopHeader({ shell }: { shell: DashboardShellState }) {
  const { t } = useLanguage();
  const { setSidebarOpen, setCommandOpen } = shell;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/40 bg-card/80 px-4 backdrop-blur-xl lg:px-8">
      <button
        type="button"
        className="lg:hidden"
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
        className="hidden gap-2 text-muted-foreground sm:flex"
        onClick={() => setCommandOpen(true)}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">{t('commandPalette.shortcutHint')}</span>
      </Button>
      <LanguageSwitcher />
      <ThemeToggle />
      <Link href="/qr/create?quick=1">
        <Button size="sm" className="gap-2 shrink-0">
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dashboard.newQrCode')}</span>
        </Button>
      </Link>
    </header>
  );
}
