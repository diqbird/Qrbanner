'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut, X, Shield } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { DASHBOARD_NAV_ITEMS } from '@/lib/dashboard-nav-items';
import { cn } from '@/lib/utils';
import type { DashboardShellState } from '@/hooks/use-dashboard-shell';
import { DashboardBrandMark } from './dashboard-brand-mark';

export function DashboardMobileSidebar({ shell }: { shell: DashboardShellState }) {
  const { t } = useLanguage();
  const { pathname, sidebarOpen, setSidebarOpen, isAdmin, chromeBrand } = shell;

  if (!sidebarOpen) return null;

  const navItems = DASHBOARD_NAV_ITEMS.map((item) => ({
    ...item,
    label: t(item.key),
  }));
  const navItemsWithAdmin = isAdmin
    ? [...navItems, { href: '/admin', label: t('superAdmin.brand'), icon: Shield }]
    : navItems;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-background/55 backdrop-blur-md"
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />
      <div className="menu-3d fixed inset-y-3 left-3 flex w-[min(18rem,calc(100vw-1.5rem))] flex-col overflow-hidden">
        <div className="flex h-16 items-center justify-between border-b border-white/20 px-5 dark:border-white/10">
          <DashboardBrandMark brand={chromeBrand} onNavigate={() => setSidebarOpen(false)} />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label={t('dashboard.closeMenu')}
            className="flex h-9 w-9 items-center justify-center rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItemsWithAdmin.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div
                  className={cn(
                    'menu-item-3d dash-nav-3d flex items-center gap-3 px-3 py-2.5 text-sm font-medium',
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
        <div className="border-t border-white/20 p-3 dark:border-white/10">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="dash-nav-3d flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            {t('common.signOut')}
          </button>
        </div>
      </div>
    </div>
  );
}
