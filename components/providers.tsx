'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/i18n/language-provider';
import { SiteSettingsProvider } from '@/components/site-settings-provider';
import { Toaster } from '@/components/ui/sonner';
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler';
import { CookieConsent } from '@/components/cookie-consent';

import { HtmlLangSync } from '@/components/i18n/html-lang-sync';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <LanguageProvider>
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
        <CookieConsent />
        <Toaster />
        <ChunkLoadErrorHandler />
      </ThemeProvider>
        </SiteSettingsProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
