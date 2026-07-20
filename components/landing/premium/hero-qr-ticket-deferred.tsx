'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HeroQrTicket = dynamic(
  () => import('./hero-qr-ticket').then((m) => ({ default: m.HeroQrTicket })),
  { ssr: false }
);

function TicketSkeleton() {
  return (
    <div
      className="jt-ticket min-h-[280px] animate-pulse rounded-sm border border-[var(--ph-rule)] bg-[var(--ph-tint)]"
      aria-hidden
    />
  );
}

/** Mounts the live QR ticket after idle so LCP/hero copy is not competing with qr-code-styling. */
export function HeroQrTicketDeferred() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(enable, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(enable, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  if (!ready) return <TicketSkeleton />;
  return <HeroQrTicket />;
}
