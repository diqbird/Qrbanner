import { CONSENT_STORAGE_KEY } from '@/lib/google-consent-mode';

const FIRST_QR_KEY = 'qrb_ga_first_qr_created';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

export function trackGaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!hasAnalyticsConsent()) return;
  try {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...params });
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch {
    /* ignore analytics failures */
  }
}

export function trackSignUp(method: string): void {
  trackGaEvent('sign_up', { method });
}

export function trackFirstQrCreated(): void {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(FIRST_QR_KEY)) return;
    localStorage.setItem(FIRST_QR_KEY, '1');
  } catch {
    /* still attempt event if storage blocked */
  }
  trackGaEvent('first_qr_created');
}
