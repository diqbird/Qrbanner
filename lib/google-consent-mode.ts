/** Shared with cookie banner + GA4 deferred loader. */
export const CONSENT_STORAGE_KEY = 'qrb-cookie-consent';

export type CookieConsentChoice = 'accepted' | 'declined';

/** Inline script — must run before any Google tag (Consent Mode v2 default). */
export function googleConsentDefaultScript(): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'denied',
  personalization_storage:'denied',
  security_storage:'granted',
  wait_for_update:500
});`;
}

/** Call after user accepts cookies, before gtag('config', ...). */
export function googleConsentGrantedScript(): string {
  return `gtag('consent','update',{
  ad_storage:'granted',
  ad_user_data:'granted',
  ad_personalization:'granted',
  analytics_storage:'granted'
});`;
}

/** Explicit deny after user declines (keeps tags in cookieless ping mode). */
export function googleConsentDeniedScript(): string {
  return `gtag('consent','update',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied'
});`;
}

export function applyGoogleConsentUpdate(choice: CookieConsentChoice): void {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args);
      };
    }
    if (choice === 'accepted') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
    } else {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    }
  } catch {
    /* ignore */
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
