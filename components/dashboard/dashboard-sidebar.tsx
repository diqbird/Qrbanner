'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { QrCode, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/components/i18n/language-provider';
import { DASHBOARD_NAV_ITEMS } from '@/lib/dashboard-nav-items';
import type { DashboardShellState } from '@/hooks/use-dashboard-shell';

export function DashboardSidebar({ shell }: { shell: DashboardShellState }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { session, pathname, isAdmin } = shell;

  const navItems = DASHBOARD_NAV_ITEMS.map((item) => ({
    ...item,
    label: t(item.key),
  }));
  const navItemsWithAdmin = isAdmin
    ? [...navItems, { href: '/admin', label: t('superAdmin.brand'), icon: Shield }]
    : navItems;

  return (
    <aside className="hidden w-64 flex-col border-r border-border/40 bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <QrCode className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">QRbanner</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItemsWithAdmin.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
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
