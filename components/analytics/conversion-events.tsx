'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { trackSignUp } from '@/lib/site-analytics';

/**
 * Fires GA4 sign_up for OAuth registrations (flagged on the JWT at first sign-in).
 */
export function ConversionEvents() {
  const { data: session, status } = useSession();
  const firedRef = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || firedRef.current) return;
    const method = session?.pendingSignUp;
    if (!method) return;
    firedRef.current = true;
    trackSignUp(method);
  }, [session?.pendingSignUp, status]);

  return null;
}
