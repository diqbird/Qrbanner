'use client';

import type { VideoEmbed } from '@/lib/marketing-config';

export function HeroVideoEmbed({ embed, label }: { embed: VideoEmbed; label: string }) {
  if (embed.type === 'mp4') {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-black shadow-xl">
        <video className="aspect-video w-full" controls playsInline preload="none" aria-label={label}>
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
