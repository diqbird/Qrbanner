import type { BlogPost } from '../../types';

export const foodTrucksQrDe: BlogPost = {
  slug: 'food-trucks-qr',
  title: 'Food-Truck-QR: Tagesmenüs, Standorte und Festival-Vorbestellungen',
  description:
    'So nutzen Food-Truck-Betreiber dynamische QR auf Fensterschildern und Festivalzelten für Tagesmenüs, Standortpläne und mobile Vorbestellungen.',
  keywords: ['Food Truck QR-Code', 'mobiler Food QR', 'Food Truck Menü QR', 'Festival Food QR', 'Food Truck Marketing'],
  publishedAt: '2026-06-30',
  updatedAt: '2026-06-30',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Gastronomie',
  sections: [
    {
      type: 'p',
      content:
        'Food Trucks drucken den QR einmal auf Fensterschilder, Festivalzelt-Banner und Visitenkarten. Kunden sehen das Menü von heute, finden den aktuellen Standort und bestellen vor — ohne veraltete Fensterbeschilderung.',
    },
    {
      type: 'h2',
      content: 'Fenster- und Festival-Touchpoints',
    },
    {
      type: 'ul',
      items: [
        'Tagesmenü-Schilder am Servicefenster',
        'Live-Standort- und Zeitplan-Seiten',
        'Festival-Vorbestellformulare',
        'Loyalty-Anmeldung auf Visitenkarten',
      ],
    },
    {
      type: 'h2',
      content: 'Betreiber mit mehreren Trucks',
    },
    {
      type: 'p',
      content:
        'Menü- und Standort-URLs jeden Morgen aus einem Dashboard aktualisieren. Ordner pro Truck zeigen, welche Festivals die meisten Vorbestell-Scans bringen.',
    },
  ],
};
