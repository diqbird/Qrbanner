'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function useDashboardShell() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const openCommand = useCallback(() => setCommandOpen(true), []);

  const focusDashboardSearch = useCallback(() => {
    window.dispatchEvent(new Event('dashboard:focus-search'));
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const callback = encodeURIComponent(pathname || '/dashboard');
      router.replace(`/login?callbackUrl=${callback}`);
    }
  }, [status, router, pathname]);

  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  return {
    session,
    status,
    pathname,
    sidebarOpen,
    setSidebarOpen,
    commandOpen,
    setCommandOpen,
    openCommand,
    focusDashboardSearch,
    isAdmin,
  };
}

export type DashboardShellState = ReturnType<typeof useDashboardShell>;
