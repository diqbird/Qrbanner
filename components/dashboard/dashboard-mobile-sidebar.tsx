'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut, X, Shield } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { DASHBOARD_NAV_ITEMS } from '@/lib/dashboard-nav-items';
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
      <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
      <div className="fixed inset-y-0 left-0 w-64 bg-card shadow-lg">
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-6">
          <DashboardBrandMark brand={chromeBrand} onNavigate={() => setSidebarOpen(false)} />
          <button onClick={() => setSidebarOpen(false)} aria-label={t('dashboard.closeMenu')}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {navItemsWithAdmin.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/40 p-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            {t('common.signOut')}
          </button>
        </div>
      </div>
    </div>
  );
}
