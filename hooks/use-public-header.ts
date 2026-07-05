'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function usePublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return {
    pathname,
    mobileOpen,
    setMobileOpen,
    scrolled,
    searchOpen,
    setSearchOpen,
    openSearch,
  };
}

export type PublicHeaderState = ReturnType<typeof usePublicHeader>;
