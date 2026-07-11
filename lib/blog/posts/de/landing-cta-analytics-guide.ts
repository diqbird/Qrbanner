import type { BlogPost } from '../../types';

export const landingCtaAnalyticsGuideDe: BlogPost = {
  slug: 'landing-page-cta-analytics-guide',
  title: 'Landingpage-CTA-Analytik: Scan-zu-Klick-Conversion messen',
  description:
    'Reine Scan-Zahlen erzählen nur die halbe Geschichte. So trackt QRbanner Button-Klicks auf Landingpages — für bessere Menüs, Coupons und App-Installs.',
  keywords: ['QR CTA-Analytik', 'Landingpage-Conversion', 'QR Marketing ROI', 'Button-Klick-Tracking'],
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-01',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Analytik',
  sections: [
    {
      type: 'p',
      content:
        'Ein Restaurant-QR kann 500 Scans pro Woche bringen — aber wie viele Gäste tippen wirklich auf „Menü anzeigen“ oder „Jetzt bestellen“? QRbanner trennt Scan-Events von CTA-Klicks auf gebrandeten Landingpages.',
    },
    {
      type: 'h2',
      content: 'Kennzahlen im Blick',
    },
    {
      type: 'ul',
      items: [
        'CTA-Klickrate pro QR-Code (Klicks ÷ Scans).',
        'Varianten vergleichen, wenn A/B-Routing aktiv ist.',
        'Mit GA4 oder Meta Pixel für nachgelagerten Umsatz verknüpfen.',
      ],
    },
    {
      type: 'h2',
      content: 'Wo Sie die Daten finden',
    },
    {
      type: 'p',
      content:
        'Beliebigen QR öffnen → Analytics. Das Landing-CTA-Panel zeigt Gesamt-Klicks, eindeutige Klicker und aktuelle Events. CSV-Export zusammen mit Land-, Geräte- und Zeit-Aufschlüsselungen für Kampagnenberichte.',
    },
    {
      type: 'h2',
      content: 'Optimierungs-Playbook',
    },
    {
      type: 'ul',
      items: [
        'Kürzere CTA-Labels testen („Bestellen“ vs. „Online bestellen tippen“).',
        'Akzentfarben an die Print-Beschilderung anpassen — für Vertrauen.',
        'Codes mit niedriger CTR umplatzieren oder Landing-Texte aktualisieren, ohne das QR-Bild neu zu drucken.',
      ],
    },
  ],
};
