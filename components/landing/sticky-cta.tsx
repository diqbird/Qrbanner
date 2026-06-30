'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { demoBookingUrl } from '@/lib/site-contact';
import { cn } from '@/lib/utils';

const HIDDEN_PREFIXES = ['/dashboard', '/admin', '/login', '/signup', '/settings'];

export function LandingStickyCta() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const demoUrl = demoBookingUrl();

  useEffect(() => {
    if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return;

    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 p-3 shadow-lg backdrop-blur-xl transition-transform duration-300 sm:hidden',
        visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      )}
      role="region"
      aria-label={t('stickyCta.create')}
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <Link href="/qr/create?quick=1" className="flex-1">
          <Button className="w-full gap-1.5 rounded-xl text-sm">
            {t('stickyCta.create')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
        <Link href={demoUrl}>
          <Button variant="outline" className="gap-1.5 rounded-xl text-sm" size="default">
            <Calendar className="h-3.5 w-3.5" />
            {t('stickyCta.demo')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
