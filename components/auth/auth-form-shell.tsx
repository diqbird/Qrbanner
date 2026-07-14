'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { hexToHslComponents } from '@/lib/color-utils';
import { useLocalePath } from '@/components/i18n/use-locale-path';
import type { InviteAuthBrand } from '@/lib/invite-brand';
import { cn } from '@/lib/utils';

type AuthFormShellProps = {
  title: React.ReactNode;
  subtitle: string;
  homeAria: string;
  children: React.ReactNode;
  beforeContent?: React.ReactNode;
  footer?: React.ReactNode;
  /** @deprecated Language lives in auth layout chrome */
  showLanguageSwitcher?: boolean;
  inviteBrand?: InviteAuthBrand | null;
};

export function AuthFormShell({
  title,
  subtitle,
  homeAria,
  children,
  beforeContent,
  footer,
  inviteBrand,
}: AuthFormShellProps) {
  const localePath = useLocalePath();
  const shellRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 8, ry: -8 });
  const [reduceMotion, setReduceMotion] = useState(false);

  const brandName = inviteBrand?.agencyName?.trim() || null;
  const logoUrl = inviteBrand?.logoUrl || null;
  const faviconUrl = inviteBrand?.faviconUrl || logoUrl;
  const brandColor = inviteBrand?.brandColor || null;
  const hsl = brandColor ? hexToHslComponents(brandColor) : null;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!brandName && !faviconUrl) return;
    const prevTitle = document.title;
    const prevIcon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    const prevHref = prevIcon?.href;
    if (brandName) {
      document.title = brandName;
    }
    if (faviconUrl && prevIcon) {
      prevIcon.href = faviconUrl;
    }
    return () => {
      document.title = prevTitle;
      if (prevIcon && prevHref) prevIcon.href = prevHref;
    };
  }, [brandName, faviconUrl]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = shellRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Math.max(-14, Math.min(14, -py * 22)),
      ry: Math.max(-16, Math.min(16, px * 24)),
    });
  };

  const onPointerLeave = () => {
    if (reduceMotion) return;
    setTilt({ rx: 8, ry: -8 });
  };

  return (
    <div
      ref={shellRef}
      className="relative w-full max-w-[440px]"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform: reduceMotion
          ? undefined
          : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: reduceMotion ? undefined : 'transform 180ms ease-out',
      }}
    >
      {/* Soft ground shadow under the card */}
      <div
        className="pointer-events-none absolute -bottom-8 left-1/2 h-16 w-[78%] -translate-x-1/2 rounded-[100%] bg-black/35 blur-2xl dark:bg-black/60"
        style={{ transform: 'translateZ(-40px) translateX(-50%)' }}
        aria-hidden
      />

      <Card
        className={cn(
          'relative w-full overflow-hidden rounded-[28px] border border-white/40 bg-card/90',
          'shadow-[0_2px_0_rgba(255,255,255,0.55)_inset,0_-1px_0_rgba(0,0,0,0.06)_inset,0_28px_60px_-20px_rgba(0,0,0,0.45),0_50px_100px_-40px_rgba(0,0,0,0.35)]',
          'dark:border-white/12 dark:bg-card/85',
          'dark:shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_30px_70px_-18px_rgba(0,0,0,0.9)]',
          'backdrop-blur-xl',
        )}
        style={
          {
            transformStyle: 'preserve-3d',
            ...(hsl
              ? ({ ['--primary' as string]: hsl, ['--brand' as string]: hsl } as React.CSSProperties)
              : {}),
          } as React.CSSProperties
        }
      >
        {/* Specular highlight for 3D glass face */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.08)_28%,transparent_48%)] dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.16)_0%,transparent_40%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-primary/25 blur-3xl"
          style={{ transform: 'translateZ(24px)' }}
          aria-hidden
        />

        <CardHeader
          className="relative space-y-3 px-6 pb-2 pt-9 text-center sm:px-8"
          style={{ transform: 'translateZ(28px)' }}
        >
          <Link
            href={localePath('/')}
            className={cn(
              'mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-primary',
              'shadow-[0_12px_28px_-8px_hsl(var(--primary)/0.7),0_1px_0_rgba(255,255,255,0.35)_inset]',
              'outline-none ring-offset-background transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring',
            )}
            aria-label={homeAria}
            style={brandColor && !logoUrl ? { backgroundColor: brandColor } : undefined}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              <QrCode className="h-5 w-5 text-primary-foreground" aria-hidden strokeWidth={2.25} />
            )}
          </Link>
          <div className="space-y-1.5">
            <CardTitle className="font-display text-[1.7rem] font-semibold tracking-tight text-foreground drop-shadow-sm">
              {title}
            </CardTitle>
            <CardDescription className="text-[13px] leading-relaxed text-muted-foreground">
              {subtitle}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent
          className="relative px-6 pb-9 pt-4 sm:px-8"
          style={{ transform: 'translateZ(16px)' }}
        >
          {beforeContent}
          {children}
          {footer}
        </CardContent>
      </Card>
    </div>
  );
}
