/** First-run onboarding — signup lands here; goal is first QR in ~60 seconds. */
export const ONBOARDING_CREATE_URL = '/qr/create?quick=1&onboarding=1';

export function isOnboardingQuery(search: string | null | undefined): boolean {
  return search === '1' || search === 'true';
}

export function onboardingQrUrl(qrId: string): string {
  return `/qr/${qrId}?onboarding=1`;
}
