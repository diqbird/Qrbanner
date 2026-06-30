'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SHOW_QR_DESCRIPTION } from '@/lib/marketing-config';

type SiteSettingsState = {
  showQrDescription: boolean;
  loaded: boolean;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsState>({
  showQrDescription: SHOW_QR_DESCRIPTION,
  loaded: false,
  refresh: async () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [showQrDescription, setShowQrDescription] = useState(SHOW_QR_DESCRIPTION);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/site-settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.showQrDescription === 'boolean') {
          setShowQrDescription(data.showQrDescription);
        }
      }
    } catch {
      /* keep env default */
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ showQrDescription, loaded, refresh }),
    [showQrDescription, loaded, refresh]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function useShowQrDescription(): boolean {
  return useContext(SiteSettingsContext).showQrDescription;
}
