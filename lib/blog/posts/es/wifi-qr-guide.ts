import type { BlogPost } from '../../types';

export const wifiQrGuideEs: BlogPost = {
  slug: 'wifi-qr-codes-guide',
  title: 'Códigos QR WiFi: Wi‑Fi para invitados sin escribir contraseñas',
  description:
    'Genera códigos QR WiFi que los invitados pueden escanear para unirse a tu red al instante. Configuración WPA2, consejos de señalización y consideraciones de seguridad para cafés, hoteles y oficinas.',
  keywords: ['código QR WiFi', 'QR WiFi invitados', 'QR WPA', 'WiFi hotel', 'QR WiFi café'],
  publishedAt: '2026-06-12',
  updatedAt: '2026-06-29',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Guías prácticas',
  sections: [
    {
      type: 'p',
      content:
        'Escribir contraseñas Wi‑Fi largas en el teclado del móvil genera fricción — especialmente para invitados. Un código QR WiFi codifica SSID, tipo de cifrado y contraseña para que iOS y Android ofrezcan «Unirse a la red» con un solo toque tras escanear.',
    },
    {
      type: 'h2',
      content: 'Qué incluir',
    },
    {
      type: 'ul',
      items: [
        'Nombre de red (SSID) exactamente como se emite.',
        'Tipo de seguridad: WPA/WPA2 es el estándar para redes de invitados.',
        'Contraseña — usa una VLAN de invitados, no tus credenciales de administrador.',
        'Opcional: indicador de red oculta si el SSID no se emite.',
      ],
    },
    {
      type: 'h2',
      content: 'Dónde mostrarlo',
    },
    {
      type: 'p',
      content:
        'Recepciones, carpetas de habitación, mesas de conferencias y carteles de entrada funcionan bien. Combina el QR con SSID y contraseña legibles para portátiles que no pueden escanear. Sustituye los códigos cuando rotes la contraseña de invitados.',
    },
    {
      type: 'h2',
      content: 'Consejos de seguridad',
    },
    {
      type: 'ul',
      items: [
        'Aísla el Wi‑Fi de invitados de las subredes de TPV y oficina.',
        'Rota contraseñas mensualmente en locales de alto tráfico.',
        'Nunca publiques credenciales de red de personal o IoT en señalización pública.',
      ],
    },
  ],
};
