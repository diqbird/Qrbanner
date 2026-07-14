'use client';

import { useEffect } from 'react';
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
  const brandName = inviteBrand?.agencyName?.trim() || null;
  const logoUrl = inviteBrand?.logoUrl || null;
  const faviconUrl = inviteBrand?.faviconUrl || logoUrl;
  const brandColor = inviteBrand?.brandColor || null;
  const hsl = brandColor ? hexToHslComponents(brandColor) : null;

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

  return (
    <Card
      className={cn(
        'w-full max-w-[420px] overflow-hidden rounded-2xl border-black/8 bg-card/95 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.35)]',
        'dark:border-white/10 dark:shadow-[0_28px_90px_-30px_rgba(0,0,0,0.85)]',
      )}
      style={hsl ? ({ ['--primary' as string]: hsl, ['--brand' as string]: hsl } as React.CSSProperties) : undefined}
    >
      <CardHeader className="space-y-3 px-6 pb-2 pt-8 text-center sm:px-8">
        <Link
          href={localePath('/')}
          className="mx-auto flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-primary shadow-sm outline-none ring-offset-background transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring"
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
          <CardTitle className="font-display text-[1.65rem] font-semibold tracking-tight text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-[13px] leading-relaxed text-muted-foreground">
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-8 pt-4 sm:px-8">
        {beforeContent}
        {children}
        {footer}
      </CardContent>
    </Card>
  );
}
