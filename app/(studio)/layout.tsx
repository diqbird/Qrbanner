import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-sm font-bold tracking-tight">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            Premium QR Studio
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
