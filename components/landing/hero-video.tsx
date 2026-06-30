'use client';

import { Play } from 'lucide-react';
import { heroVideoEmbed } from '@/lib/marketing-config';

function DashboardPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl">
      <div className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="text-xs text-muted-foreground">qrbanner.com/dashboard</span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <div className="rounded-xl bg-primary/10 p-4">
          <p className="text-xs font-medium text-muted-foreground">Scans today</p>
          <p className="font-display text-2xl font-bold text-primary">1,248</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground">Active QR codes</p>
          <p className="font-display text-2xl font-bold">86</p>
        </div>
        <div className="col-span-full flex items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 py-8">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-lg border-4 border-foreground bg-background shadow-inner">
              <div className="grid grid-cols-3 gap-0.5 p-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-sm bg-foreground" />
                ))}
              </div>
            </div>
            <p className="text-sm font-medium">Summer Menu — Table 12</p>
            <p className="text-xs text-muted-foreground">Dynamic · 342 scans</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroVideo({ label }: { label: string }) {
  const embed = heroVideoEmbed();

  if (!embed) {
    return (
      <div className="relative">
        <DashboardPreview />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
            <Play className="h-6 w-6 fill-current ml-0.5" aria-hidden />
          </div>
        </div>
      </div>
    );
  }

  if (embed.type === 'mp4') {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-black shadow-xl">
        <video
          className="aspect-video w-full"
          controls
          playsInline
          preload="metadata"
          poster="/opengraph-image"
          aria-label={label}
        >
          <source src={embed.src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-xl">
      <iframe
        src={embed.src}
        title={label}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
