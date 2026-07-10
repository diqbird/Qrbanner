'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/i18n/language-provider';
import { SiteSettingsProvider } from '@/components/site-settings-provider';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import { CookieConsent } from '@/components/cookie-consent';
import { ConversionEvents } from '@/components/analytics/conversion-events';

import { HtmlLangSync } from '@/components/i18n/html-lang-sync';

import type { Locale } from '@/lib/i18n';

export function Providers({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <LanguageProvider initialLocale={initialLocale}>
        <HtmlLangSync />
        <SiteSettingsProvider>
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="qrbanner-theme"
        disableTransitionOnChange
      >
        {children}
        <ConversionEvents />
        <CookieConsent />
        <Toaster />
        <ChunkLoadErrorHandler />
      </ThemeProvider>
        </SiteSettingsProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
