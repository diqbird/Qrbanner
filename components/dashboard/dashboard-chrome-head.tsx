'use client';

import { useEffect } from 'react';
import type { DashboardChromeBrand } from '@/hooks/use-dashboard-shell';

const FAVICON_ATTR = 'data-qrb-wl-favicon';

function ensureFaviconLink(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>(`link[${FAVICON_ATTR}]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.setAttribute(FAVICON_ATTR, '1');
    document.head.appendChild(link);
  }
  return link;
}

/**
 * Applies white-label document title and favicon for Business/Agency dashboards.
 */
export function DashboardChromeHead({ brand }: { brand: DashboardChromeBrand }) {
  useEffect(() => {
    if (!brand.whiteLabel) {
      document.querySelector(`link[${FAVICON_ATTR}]`)?.remove();
      return;
    }

    const previousTitle = document.title;
    if (brand.displayName) {
      document.title = brand.displayName;
    }

    if (brand.faviconUrl) {
      ensureFaviconLink().href = brand.faviconUrl;
    } else {
      document.querySelector(`link[${FAVICON_ATTR}]`)?.remove();
    }

    return () => {
      document.title = previousTitle;
      document.querySelector(`link[${FAVICON_ATTR}]`)?.remove();
    };
  }, [brand.whiteLabel, brand.displayName, brand.faviconUrl]);

  return null;
}
