'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ADMIN_MODULES, findAdminModule } from '@/lib/admin/modules';
import { useAdminUiStore } from '@/stores/admin-ui-store';
import { useLanguage } from '@/components/i18n/language-provider';
import { cn } from '@/lib/utils';

export function AdminHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const mobileOpen = useAdminUiStore((s) => s.mobileNavOpen);
  const setMobileOpen = useAdminUiStore((s) => s.setMobileNavOpen);
  const current = findAdminModule(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-sm">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="flex items-center gap-2 font-display">
              <Shield className="h-5 w-5 text-primary" />
              {t('superAdmin.brand')}
            </DialogTitle>
          </DialogHeader>
          <nav className="p-2 space-y-1">
            {ADMIN_MODULES.map((mod) => {
              const Icon = mod.icon;
              const active =
                mod.href === '/admin' ? pathname === '/admin' : pathname.startsWith(mod.href);
              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm',
                    active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(mod.labelKey)}
                </Link>
              );
            })}
          </nav>
        </DialogContent>
      </Dialog>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {current ? t(current.labelKey) : t('superAdmin.nav.dashboard')}
        </p>
      </div>
      <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground hidden sm:block">
        {t('superAdmin.backToApp')}
      </Link>
    </header>
  );
}
