'use client';

import { SkipToMain } from '@/components/skip-to-main';
import {
  DashboardCommandPalette,
  useDashboardCommandShortcut,
} from '@/components/dashboard/dashboard-command-palette';
import { useDashboardShell } from '@/hooks/use-dashboard-shell';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardMobileSidebar } from './dashboard-mobile-sidebar';
import { DashboardTopHeader } from './dashboard-top-header';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const shell = useDashboardShell();
  const { status, commandOpen, setCommandOpen, focusDashboardSearch } = shell;

  useDashboardCommandShortcut(shell.openCommand);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="flex min-h-screen bg-muted/20">
      <SkipToMain />
      <DashboardCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onFocusSearch={focusDashboardSearch}
      />
      <DashboardSidebar shell={shell} />
      <DashboardMobileSidebar shell={shell} />
      <div className="flex flex-1 flex-col">
        <DashboardTopHeader shell={shell} />
        <main id="main-content" className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
