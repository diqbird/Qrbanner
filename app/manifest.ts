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
    theme_color: '#4f46e5',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/icon', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        url: '/dashboard',
        icons: [{ src: '/icon', sizes: '96x96' }],
      },
      {
        name: 'Create QR',
        short_name: 'Create',
        url: '/qr/create',
        icons: [{ src: '/icon', sizes: '96x96' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    id: `${base}/dashboard`,
  };
}
