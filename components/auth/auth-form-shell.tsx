'use client';

import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';

type AuthFormShellProps = {
  title: React.ReactNode;
  subtitle: string;
  homeAria: string;
  children: React.ReactNode;
  beforeContent?: React.ReactNode;
  footer?: React.ReactNode;
  showLanguageSwitcher?: boolean;
};

export function AuthFormShell({
  title,
  subtitle,
  homeAria,
  children,
  beforeContent,
  footer,
  showLanguageSwitcher = true,
}: AuthFormShellProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        {showLanguageSwitcher ? (
          <div className="mb-2 flex justify-end">
            <LanguageSwitcher />
          </div>
        ) : null}
        <Link
          href="/"
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary"
          aria-label={homeAria}
        >
          <QrCode className="h-7 w-7 text-primary-foreground" aria-hidden />
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
