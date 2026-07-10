import { describe, expect, it } from 'vitest';
import { wwwToApexRedirectUrl } from '@/lib/canonical-host';

describe('wwwToApexRedirectUrl', () => {
  it('redirects www to apex with path and query preserved', () => {
    const req = new URL('https://www.qrbanner.com/pricing?ref=ads');
    const target = wwwToApexRedirectUrl(req, 'www.qrbanner.com');
    expect(target?.href).toBe('https://qrbanner.com/pricing?ref=ads');
  });

  it('ignores apex and localhost', () => {
    const req = new URL('https://qrbanner.com/');
    expect(wwwToApexRedirectUrl(req, 'qrbanner.com')).toBeNull();
    expect(wwwToApexRedirectUrl(req, 'localhost:3000')).toBeNull();
  });
});
