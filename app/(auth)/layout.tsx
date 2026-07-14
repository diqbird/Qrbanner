'use client';

import Link from 'next/link';
import { SiteLogo } from '@/components/brand/site-logo';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLanguage } from '@/components/i18n/language-provider';
import { useLocalePath } from '@/components/i18n/use-locale-path';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const localePath = useLocalePath();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Depth stage */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--primary)/0.18),transparent_52%)]" />
        <div className="absolute -left-[18%] top-[12%] h-[42vmin] w-[42vmin] rounded-full bg-primary/25 blur-[90px] auth-orb-a motion-safe:animate-[auth-orb-a_14s_ease-in-out_infinite]" />
        <div className="absolute -right-[12%] top-[28%] h-[36vmin] w-[36vmin] rounded-full bg-foreground/[0.07] blur-[100px] auth-orb-b motion-safe:animate-[auth-orb-b_18s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] left-1/2 h-[48vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />
        <div
          className="absolute inset-x-0 bottom-0 h-[48vh] origin-bottom scale-x-150 opacity-40 dark:opacity-30"
          style={{
            background:
              'linear-gradient(to top, hsl(var(--foreground) / 0.08), transparent), repeating-linear-gradient(90deg, hsl(var(--foreground) / 0.06) 0 1px, transparent 1px 48px), repeating-linear-gradient(0deg, hsl(var(--foreground) / 0.05) 0 1px, transparent 1px 48px)',
            transform: 'perspective(900px) rotateX(62deg) translateY(18%)',
            maskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
          }}
        />
      </div>

      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
        <Link
          href={localePath('/')}
          className="rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('common.homeAria')}
        >
          <SiteLogo layout="inline" />
        </Link>
        <div className="flex items-center gap-0.5 rounded-full border border-black/8 bg-background/70 px-1 py-0.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:border-white/10">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-20 pt-6 sm:pt-10 [perspective:1400px]">
        {children}
      </main>
    </div>
  );
}
