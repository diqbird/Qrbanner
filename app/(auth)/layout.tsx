'use client';

import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
