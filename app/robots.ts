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
        allow: ['/', '/qr/create'],
        disallow: [
          '/api/',
          '/dashboard/',
          '/qr/',
          '/settings/',
          '/s/',
          '/verify',
          '/login',
          '/signup',
          '/invite/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
