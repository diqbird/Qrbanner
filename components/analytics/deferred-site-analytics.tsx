'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import {
  googleConsentGrantedScript,
  CONSENT_STORAGE_KEY,
} from '@/lib/google-consent-mode';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()?.toUpperCase();
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim()?.toUpperCase();

function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

/**
 * Loads GA4 + GTM only after cookie consent — lazyOnload to protect LCP/INP.
 */
export function DeferredSiteAnalytics({ nonce }: { nonce?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (hasAnalyticsConsent()) setEnabled(true);

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === 'accepted') setEnabled(true);
    };
    window.addEventListener('cookie-consent', onConsent);
    return () => window.removeEventListener('cookie-consent', onConsent);
  }, []);

  if (!enabled) return null;

  const validGa = GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID);
  const validGtm = GTM_ID && /^GTM-[A-Z0-9]+$/.test(GTM_ID);

  return (
    <>
      {validGtm && (
        <Script id="gtm-init" strategy="lazyOnload" nonce={nonce}>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      {validGtm && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
      {validGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
            nonce={nonce}
          />
          <Script id="ga-config" strategy="lazyOnload" nonce={nonce}>
            {`${googleConsentGrantedScript()}
gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
