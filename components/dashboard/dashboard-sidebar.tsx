'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/components/i18n/language-provider';
import { DASHBOARD_NAV_ITEMS } from '@/lib/dashboard-nav-items';
import { cn } from '@/lib/utils';
import type { DashboardShellState } from '@/hooks/use-dashboard-shell';
import { DashboardBrandMark } from './dashboard-brand-mark';

export function DashboardSidebar({ shell }: { shell: DashboardShellState }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { session, pathname, isAdmin, chromeBrand } = shell;

  const navItems = DASHBOARD_NAV_ITEMS.map((item) => ({
    ...item,
    label: t(item.key),
  }));
  const navItemsWithAdmin = isAdmin
    ? [...navItems, { href: '/admin', label: t('superAdmin.brand'), icon: Shield }]
    : navItems;

  return (
    <aside
      className={cn(
        'hidden w-64 flex-col border-r border-white/25 bg-card/70 backdrop-blur-2xl lg:flex',
        'shadow-[1px_0_0_rgba(255,255,255,0.28)_inset] dark:border-white/10 dark:bg-card/55',
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/20 px-6 dark:border-white/10">
        <DashboardBrandMark brand={chromeBrand} />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItemsWithAdmin.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'dash-nav-3d flex items-center gap-3 px-3 py-2.5 text-sm font-medium',
                  isActive
                    ? 'dash-nav-3d-active'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/20 p-4 dark:border-white/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="dash-nav-3d flex w-full items-center gap-3 px-3 py-2 text-sm hover:text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shadow-[0_8px_18px_-12px_hsl(var(--primary)/0.7)]">
                {session?.user?.name?.[0]?.toUpperCase() ?? session?.user?.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 text-left">
                <p className="truncate font-medium">{session?.user?.name ?? t('common.accountNameFallback')}</p>
                <p className="truncate text-xs text-muted-foreground">{session?.user?.email ?? ''}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" /> {t('dashboard.settings')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="mr-2 h-4 w-4" /> {t('common.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
