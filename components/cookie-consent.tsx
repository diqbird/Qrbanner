'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';

import { applyGoogleConsentUpdate, CONSENT_STORAGE_KEY } from '@/lib/google-consent-mode';

const STORAGE_KEY = CONSENT_STORAGE_KEY;

export function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const setChoice = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    applyGoogleConsentUpdate(value);
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-labelledby="cookie-consent-message"
      className="fixed left-0 right-0 top-16 z-[90] border-b border-border/60 bg-card/95 p-3 shadow-lg backdrop-blur-sm sm:top-auto sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-xl sm:border sm:p-4"
    >
      <p id="cookie-consent-message" className="text-sm text-muted-foreground">{t('cookie.message')}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setChoice('accepted')}>
          {t('cookie.accept')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setChoice('declined')}>
          {t('cookie.decline')}
        </Button>
        <Link href="/privacy" className="self-center text-xs text-muted-foreground hover:text-foreground">
          {t('footer.privacy')}
        </Link>
        <Link href="/cookies" className="self-center text-xs text-muted-foreground hover:text-foreground">
          {t('footer.cookies')}
        </Link>
      </div>
    </div>
  );
}
