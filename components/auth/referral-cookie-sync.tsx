'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const COOKIE_NAME = 'qrb_ref';
const MAX_AGE_DAYS = 30;

export function ReferralCookieSync() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref')?.trim();

  useEffect(() => {
    if (!ref) return;
    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(ref)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, [ref]);

  return null;
}
