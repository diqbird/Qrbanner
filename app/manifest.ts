import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  const base = SITE_URL.replace(/\/$/, '');
  return {
    name: `${SITE_NAME} — QR Manager`,
    short_name: SITE_NAME,
    description:
      'Manage dynamic QR codes, track scans and get alerts — install QRbanner on your phone or desktop.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#004080',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/icons/icon-192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        url: '/dashboard',
        icons: [{ src: '/icons/icon-192', sizes: '192x192' }],
      },
      {
        name: 'Create QR',
        short_name: 'Create',
        url: '/qr/create',
        icons: [{ src: '/icons/icon-192', sizes: '192x192' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    id: `${base}/dashboard`,
  };
}
