import Script from 'next/script';
import { googleConsentDefaultScript } from '@/lib/google-consent-mode';

/** Sets Consent Mode v2 defaults before any Google tag loads. */
export function ConsentModeBootstrap() {
  return (
    <Script id="google-consent-default" strategy="beforeInteractive">
      {googleConsentDefaultScript()}
    </Script>
  );
}
