'use client';

import { useEffect } from 'react';
import { CRISP_WEBSITE_ID } from '@/lib/marketing-config';

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

function loadCrisp() {
  if (!CRISP_WEBSITE_ID || typeof window === 'undefined') return;
  if (window.CRISP_WEBSITE_ID) return;

  window.$crisp = [];
  window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

  const script = document.createElement('script');
  script.src = 'https://client.crisp.chat/l.js';
  script.async = true;
  document.head.appendChild(script);
}

export function LiveChat() {
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => loadCrisp(), { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(loadCrisp, 5000);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
