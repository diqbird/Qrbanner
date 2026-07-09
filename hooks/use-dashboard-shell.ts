'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { canUseWhiteLabel, parseBrandingSettings, type BrandingSettings } from '@/lib/referral';

export type DashboardChromeBrand = {
  displayName: string;
  logoUrl?: string;
  faviconUrl?: string;
  brandColor?: string;
  supportEmail?: string;
  whiteLabel: boolean;
};

const DEFAULT_CHROME: DashboardChromeBrand = {
  displayName: 'QRbanner',
  whiteLabel: false,
};

export function useDashboardShell() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [chromeBrand, setChromeBrand] = useState<DashboardChromeBrand>(DEFAULT_CHROME);

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

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/referral');
        if (!res.ok) return;
        const json = (await res.json()) as {
          plan?: string;
          branding?: BrandingSettings;
        };
        if (cancelled) return;
        const plan = json.plan ?? 'free';
        const branding = parseBrandingSettings(json.branding);
        const whiteLabel = canUseWhiteLabel(plan);
        if (!whiteLabel) {
          setChromeBrand(DEFAULT_CHROME);
          return;
        }
        const agencyName = branding.agencyName?.trim();
        setChromeBrand({
          displayName: agencyName || 'QRbanner',
          logoUrl: branding.logoUrl,
          faviconUrl: branding.faviconUrl,
          brandColor: branding.brandColor,
          supportEmail: branding.supportEmail?.trim() || undefined,
          whiteLabel: true,
        });
      } catch {
        /* keep default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

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
    chromeBrand,
  };
}

export type DashboardShellState = ReturnType<typeof useDashboardShell>;
