import { MetadataRoute } from 'next';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  'https://qrbanner.com'
).replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Public QR create wizard must stay crawlable; other /qr/* routes are app UI.
        allow: ['/', '/qr/create'],
        disallow: [
          '/api/',
          '/dashboard/',
          '/qr/',
          '/settings/',
          '/admin/',
          '/studio/',
          '/s/',
          '/pay',
          '/verify',
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/mfa-verify',
          '/invite/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
