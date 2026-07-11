import type { BlogPost } from '../../types';

export const manufacturingQrCodesDe: BlogPost = {
  slug: 'manufacturing-qr-codes',
  title: 'Fertigungs-QR-Codes: Arbeitsanweisungen, Assets & Qualitätschecks',
  description:
    'Fabriken nutzen dynamische QR an Maschinen, Arbeitsaufträgen und Qualitätsstationen — SOP-PDFs und Prüfformulare aktualisieren, ohne Geräte neu zu beschriften.',
  keywords: ['Fertigungs QR-Code', 'Fabrik QR', 'Arbeitsanweisung QR', 'Asset-Tag QR', 'Qualitätskontrolle QR'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Fertigung',
  sections: [
    {
      type: 'p',
      content:
        'Werke aktualisieren SOPs häufig, Maschinenlabels halten Jahre. Dynamische QR an Geräte-Tags und Stationsboards halten Techniker auf der aktuellen Arbeitsanweisungs-URL.',
    },
    {
      type: 'h2',
      content: 'Platzierungen in der Werkstatt',
    },
    {
      type: 'ul',
      items: [
        'CNC- und Montage-Stations-SOP-Links',
        'Präventive Wartungs-Checklisten',
        'Ersatzteil-Bestellportale',
        'Sicherheitsdatenblätter (SDS) nach Chemikalienzone',
      ],
    },
    {
      type: 'h2',
      content: 'Governance',
    },
    {
      type: 'p',
      content:
        'Schützen Sie interne Codes mit Passwort. Protokollieren Sie Revisionsdaten auf Landingpages. Nutzen Sie Batch-Labels pro Fertigungslinie, um Scan-Adoption nach Schulungs-Rollouts zu vergleichen.',
    },
  ],
};
