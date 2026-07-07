'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ADMIN_MODULES, groupAdminModules } from '@/lib/admin/modules';
import { useAdminUiStore } from '@/stores/admin-ui-store';
import { useLanguage } from '@/components/i18n/language-provider';

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const collapsed = useAdminUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useAdminUiStore((s) => s.setSidebarCollapsed);
  const groups = groupAdminModules(ADMIN_MODULES);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
        <Shield className="h-5 w-5 shrink-0 text-primary" />
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold">{t('superAdmin.brand')}</p>
            <p className="truncate text-[10px] text-muted-foreground">{t('superAdmin.brandHint')}</p>
          </div>
        ) : null}
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {Array.from(groups.entries()).map(([groupKey, modules]) => (
          <div key={groupKey}>
            {!collapsed ? (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t(groupKey)}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {modules.map((mod: (typeof ADMIN_MODULES)[number]) => {
                const active =
                  mod.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(mod.href);
                const Icon = mod.icon;
                return (
                  <li key={mod.id}>
                    <Link
                      href={mod.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                        active
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                      )}
                      title={collapsed ? t(mod.labelKey) : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed ? (
                        <>
                          <span className="truncate flex-1">{t(mod.labelKey)}</span>
                          {mod.status !== 'live' ? (
                            <Badge variant="outline" className="text-[9px] px-1 py-0">
                              {mod.status === 'beta' ? 'β' : '•'}
                            </Badge>
                          ) : null}
                        </>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-border/60 p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        {!collapsed ? (
          <Link
            href="/dashboard"
            className="mt-1 flex items-center justify-center rounded-lg px-2 py-2 text-xs text-muted-foreground hover:bg-muted/60"
          >
            ← {t('superAdmin.backToApp')}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
