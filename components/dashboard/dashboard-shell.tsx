'use client';

import { SkipToMain } from '@/components/skip-to-main';
import {
  DashboardCommandPalette,
  useDashboardCommandShortcut,
} from '@/components/dashboard/dashboard-command-palette';
import { useDashboardShell } from '@/hooks/use-dashboard-shell';
import { hexToHslComponents } from '@/lib/color-utils';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardMobileSidebar } from './dashboard-mobile-sidebar';
import { DashboardTopHeader } from './dashboard-top-header';
import { DashboardChromeHead } from './dashboard-chrome-head';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const shell = useDashboardShell();
  const { status, commandOpen, setCommandOpen, focusDashboardSearch } = shell;

  useDashboardCommandShortcut(shell.openCommand);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center dash-shell-stage">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  const brandColor = shell.chromeBrand.brandColor;
  const hsl = brandColor ? hexToHslComponents(brandColor) : null;
  const rootStyle = hsl
    ? ({
        ['--primary' as string]: hsl,
        ['--ring' as string]: hsl,
        ['--brand' as string]: brandColor,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className="relative flex min-h-screen dash-shell-stage" style={rootStyle}>
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-[18%] top-[8%] h-[42vmin] w-[42vmin] rounded-full bg-primary/25 blur-[100px] auth-orb-a motion-safe:animate-[auth-orb-a_16s_ease-in-out_infinite]" />
        <div className="absolute -right-[14%] top-[22%] h-[36vmin] w-[36vmin] rounded-full bg-foreground/[0.07] blur-[110px] auth-orb-b motion-safe:animate-[auth-orb-b_20s_ease-in-out_infinite]" />
      </div>
      <DashboardChromeHead brand={shell.chromeBrand} />
      <SkipToMain />
      <DashboardCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onFocusSearch={focusDashboardSearch}
      />
      <DashboardSidebar shell={shell} />
      <DashboardMobileSidebar shell={shell} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopHeader shell={shell} />
        <main id="main-content" className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
