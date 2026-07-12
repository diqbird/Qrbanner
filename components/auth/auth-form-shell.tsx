'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { hexToHslComponents } from '@/lib/color-utils';
import type { InviteAuthBrand } from '@/lib/invite-brand';

type AuthFormShellProps = {
  title: React.ReactNode;
  subtitle: string;
  homeAria: string;
  children: React.ReactNode;
  beforeContent?: React.ReactNode;
  footer?: React.ReactNode;
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
  showLanguageSwitcher = true,
  inviteBrand,
}: AuthFormShellProps) {
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
      className="w-full max-w-md"
      style={hsl ? ({ ['--primary' as string]: hsl, ['--brand' as string]: hsl } as React.CSSProperties) : undefined}
    >
      <CardHeader className="text-center">
        {showLanguageSwitcher ? (
          <div className="mb-2 flex justify-end">
            <LanguageSwitcher />
          </div>
        ) : null}
        <Link
          href="/"
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary"
          aria-label={homeAria}
          style={brandColor && !logoUrl ? { backgroundColor: brandColor } : undefined}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-full w-full object-contain p-1" />
          ) : (
            <QrCode className="h-7 w-7 text-primary-foreground" aria-hidden />
          )}
        </Link>
        <CardTitle className="font-display text-2xl tracking-tight">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {beforeContent}
        {children}
        {footer}
      </CardContent>
    </Card>
  );
}
