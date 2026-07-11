import type { BlogPost } from '../../types';

export const restaurantMenuQrDe: BlogPost = {
  slug: 'restaurant-menu-qr-codes',
  title: 'Restaurant-Menü QR-Codes: Einrichtung, Design & Best Practices (2026)',
  description:
    'So ersetzen Sie Papier-Speisekarten durch dynamische QR-Codes — Platzierungstipps, Größen, hygienefreundliches Design und Gerichte aktualisieren ohne Neudruck.',
  keywords: ['Restaurant-Menü QR', 'digitale Menü QR', 'QR-Code Speisekarte', 'Gastronomie QR', 'Tischaufsteller QR'],
  publishedAt: '2026-06-10',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Gastgewerbe',
  sections: [
    {
      type: 'p',
      content:
        'Papier-Speisekarten sind teuer im Neudruck und langsam zu aktualisieren, wenn sich Preise oder Allergene ändern. Ein dynamischer Menü-QR-Code an jedem Tisch lässt Gäste einmal scannen und immer Ihre neueste PDF- oder Web-Speisekarte sehen — während Sie verfolgen, welche Standorte die meisten Scans erzielen.',
    },
    {
      type: 'h2',
      content: 'Warum dynamische (nicht statische) Menü-QR-Codes?',
    },
    {
      type: 'ul',
      items: [
        'Menü-URL oder PDF nach dem Druck ändern — keine neuen Aufkleber nötig.',
        'Scan-Zahlen nach Tisch, Tageszeit oder Kampagne einsehen.',
        'Gebrandete Landingpage hinzufügen, bevor die Speisekarte geöffnet wird.',
        'Mittags- vs. Abendmenüs per Zeitplan-Routing steuern.',
      ],
    },
    {
      type: 'h2',
      content: 'Platzierung und Größe',
    },
    {
      type: 'p',
      content:
        'Platzieren Sie Codes auf Augenhöhe auf Tischaufstellern, Rechnungsmappen oder Fensteraufklebern. Mindest-Druckgröße ist etwa 2×2 cm (0,8 Zoll) mit Ruhezone-Rand. Verwenden Sie hohen Kontrast (dunkler Code auf hellem Hintergrund) und testen Sie Scans aus 30–50 cm Entfernung unter Ihrer Restaurant-Beleuchtung.',
    },
    {
      type: 'h2',
      content: 'Inhalte, die konvertieren',
    },
    {
      type: 'p',
      content:
        'Beginnen Sie mit einer kurzen Überschrift auf Ihrer Landingpage („Heutige Speisekarte“) und einem klaren Button. Halten Sie die finale Speisekarte mobile-first: große Touch-Targets, Allergen-Icons und schnell ladende Bilder. Aktualisieren Sie saisonale Gerichte in Sekunden über Ihr QRbanner-Dashboard.',
    },
    {
      type: 'faq',
      faq: [
        {
          question: 'Kann ich einen QR-Code für jeden Tisch verwenden?',
          answer:
            'Ja. Ein dynamischer Code funktioniert überall. Separate Codes pro Standort nur, wenn Sie granulare Analytik pro Raum oder Terrasse wünschen.',
        },
        {
          question: 'Was, wenn das Wi‑Fi schwach ist?',
          answer:
            'Hosten Sie Speisekarten auf einem schnellen CDN oder einer leichten HTML-Seite. Bieten Sie ein herunterladbares PDF als Fallback im selben QR-Ziel an.',
        },
      ],
    },
  ],
};
