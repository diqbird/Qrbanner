'use client';

import Link from 'next/link';
import { QrCode } from 'lucide-react';
import type { DashboardChromeBrand } from '@/hooks/use-dashboard-shell';

export function DashboardBrandMark({
  brand,
  href = '/dashboard',
  onNavigate,
}: {
  brand: DashboardChromeBrand;
  href?: string;
  onNavigate?: () => void;
}) {
  const accent = brand.brandColor || undefined;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80"
    >
      {brand.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logoUrl}
          alt=""
          className="h-9 w-9 rounded-lg object-contain bg-muted"
        />
      ) : (
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
          style={accent ? { backgroundColor: accent } : undefined}
        >
          <QrCode className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
      <span className="font-display text-lg font-bold truncate max-w-[9rem]">{brand.displayName}</span>
    </Link>
  );
}
