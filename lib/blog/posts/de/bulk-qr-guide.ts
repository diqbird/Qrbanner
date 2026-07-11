import type { BlogPost } from '../../types';

export const bulkQrGuideDe: BlogPost = {
  slug: 'bulk-qr-codes-csv-import',
  title: 'QR-Codes in Masse: CSV-Import für Multi-Standort-Rollouts',
  description:
    'Hunderte dynamische QR-Codes aus einer Tabelle erstellen — ideal für Filialketten, Events und Produktverpackung. CSV-Format, Namenskonvention und QA-Checkliste.',
  keywords: ['Massen-QR-Codes', 'CSV QR-Import', 'Massen-QR-Generator', 'Retail QR-Rollout', 'QR-Batch'],
  publishedAt: '2026-06-22',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Betrieb',
  sections: [
    {
      type: 'p',
      content:
        'QR-Codes manuell für Dutzende Filialen oder SKUs anzulegen ist langsam und fehleranfällig. Der QRbanner-Massenimport liest eine CSV, erzeugt dynamische Codes in einem Batch und weist eine gemeinsame Batch-ID zu — damit filtern Sie die Kampagne später leicht.',
    },
    {
      type: 'h2',
      content: 'CSV-Spalten',
    },
    {
      type: 'ul',
      items: [
        'name — Bezeichnung im Dashboard (z. B. „Filiale 042 – Eingang“).',
        'category — url, menu, vcard, wifi usw.',
        'content — Ziel-URL oder kategorieabhängige Nutzlast.',
        'Optional: Ordner, Labels, UTM-Tags pro Zeile.',
      ],
    },
    {
      type: 'h2',
      content: 'Checkliste vor dem Import',
    },
    {
      type: 'ul',
      items: [
        'URLs vor dem Import auf HTTP 200 prüfen.',
        'Einheitliche Namenskonvention für Reporting nutzen.',
        'Ergebnis-CSV mit Short Codes für Ihren Druckpartner exportieren.',
        'Nach dem Import 5 zufällige Codes auf iOS und Android stichprobenartig testen.',
      ],
    },
    {
      type: 'h2',
      content: 'Nach dem Import',
    },
    {
      type: 'p',
      content:
        'Öffnen Sie den Kampagnenfilter im Dashboard, um den gesamten Batch zu sehen. Wenden Sie eine gemeinsame Stilvorlage für druckfertige PNG/SVG-Exporte an. Plan-Limits begrenzen die Zeilenanzahl — vor großen Rollouts upgraden.',
    },
  ],
};
