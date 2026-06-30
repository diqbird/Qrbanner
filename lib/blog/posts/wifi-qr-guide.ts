import type { BlogPost } from '../types';

export const wifiQrGuide: BlogPost = {
  slug: 'wifi-qr-codes-guide',
  title: 'WiFi QR Codes: Guest Wi‑Fi Without Typing Passwords',
  description:
    'Generate WiFi QR codes guests can scan to join your network instantly. WPA2 setup, signage tips, and security considerations for cafes, hotels and offices.',
  keywords: ['WiFi QR code', 'guest WiFi QR', 'WPA QR', 'hotel WiFi', 'cafe WiFi QR'],
  publishedAt: '2026-06-12',
  updatedAt: '2026-06-29',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'How-To',
  sections: [
    {
      type: 'p',
      content:
        'Typing long Wi‑Fi passwords on a phone keyboard is friction — especially for guests. A WiFi QR code encodes SSID, encryption type, and password so iOS and Android can offer “Join Network” in one tap after scanning.',
    },
    {
      type: 'h2',
      content: 'What to include',
    },
    {
      type: 'ul',
      items: [
        'Network name (SSID) exactly as broadcast.',
        'Security type: WPA/WPA2 is standard for guest networks.',
        'Password — use a guest VLAN, not your admin credentials.',
        'Optional: hidden network flag if SSID is not broadcast.',
      ],
    },
    {
      type: 'h2',
      content: 'Where to display',
    },
    {
      type: 'p',
      content:
        'Reception desks, room folders, conference tables, and entrance posters work well. Pair the QR with human-readable SSID and password for laptops that cannot scan. Replace codes when you rotate the guest password.',
    },
    {
      type: 'h2',
      content: 'Security tips',
    },
    {
      type: 'ul',
      items: [
        'Isolate guest Wi‑Fi from POS and office subnets.',
        'Rotate passwords monthly in high-traffic venues.',
        'Never publish staff or IoT network credentials on public signage.',
      ],
    },
  ],
};
