'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, X } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

const DISMISS_KEY = 'qrb-pwa-install-dismissed';

export function PwaInstallBanner() {
  const { t } = useLanguage();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }

    if (standalone || localStorage.getItem(DISMISS_KEY) === '1') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  }, [deferred]);

  if (isStandalone || !visible) return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <Smartphone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">{t('mobileApps.installTitle')}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('mobileApps.installDesc')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={install}>{t('mobileApps.installBtn')}</Button>
        <Button size="icon-sm" variant="ghost" onClick={dismiss} aria-label={t('common.dismissAria')}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
