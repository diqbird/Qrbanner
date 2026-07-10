import { describe, expect, it } from 'vitest';
import { googleConsentDefaultScript, googleConsentGrantedScript } from '@/lib/google-consent-mode';

describe('google consent mode scripts', () => {
  it('sets v2 default denied state', () => {
    expect(googleConsentDefaultScript()).toContain("analytics_storage:'denied'");
    expect(googleConsentDefaultScript()).toContain("ad_user_data:'denied'");
  });

  it('grants analytics on accept', () => {
    expect(googleConsentGrantedScript()).toContain("analytics_storage:'granted'");
  });
});
