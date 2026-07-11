import type { BlogPost } from '../../types';

export const wifiQrGuideDe: BlogPost = {
  slug: 'wifi-qr-codes-guide',
  title: 'WiFi QR-Codes: Gast-WLAN ohne Passwort-Eingabe',
  description:
    'Erstellen Sie WiFi QR-Codes, die Gäste scannen können, um sofort Ihrem Netzwerk beizutreten. WPA2-Einrichtung, Beschilderungstipps und Sicherheitsaspekte für Cafés, Hotels und Büros.',
  keywords: ['WiFi QR-Code', 'Gast-WLAN QR', 'WPA QR', 'Hotel WiFi', 'Café WiFi QR'],
  publishedAt: '2026-06-12',
  updatedAt: '2026-06-29',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Anleitung',
  sections: [
    {
      type: 'p',
      content:
        'Lange Wi‑Fi-Passwörter auf der Smartphone-Tastatur einzutippen, erzeugt Reibung — besonders für Gäste. Ein WiFi QR-Code kodiert SSID, Verschlüsselungstyp und Passwort, sodass iOS und Android nach dem Scannen „Netzwerk beitreten“ mit einem Tipp anbieten.',
    },
    {
      type: 'h2',
      content: 'Was enthalten sein sollte',
    },
    {
      type: 'ul',
      items: [
        'Netzwerkname (SSID) exakt wie ausgestrahlt.',
        'Sicherheitstyp: WPA/WPA2 ist Standard für Gastnetzwerke.',
        'Passwort — Gast-VLAN verwenden, nicht Ihre Admin-Zugangsdaten.',
        'Optional: Hidden-Network-Flag, wenn die SSID nicht ausgestrahlt wird.',
      ],
    },
    {
      type: 'h2',
      content: 'Wo anbringen',
    },
    {
      type: 'p',
      content:
        'Rezeption, Zimmerordner, Konferenztische und Eingangs-Poster eignen sich gut. Ergänzen Sie den QR-Code um lesbare SSID und Passwort für Laptops, die nicht scannen können. Ersetzen Sie Codes, wenn Sie das Gast-Passwort rotieren.',
    },
    {
      type: 'h2',
      content: 'Sicherheitstipps',
    },
    {
      type: 'ul',
      items: [
        'Gast-WLAN von Kassen- und Büro-Subnetzen isolieren.',
        'Passwörter in stark frequentierten Locations monatlich rotieren.',
        'Mitarbeiter- oder IoT-Netzwerk-Zugangsdaten niemals auf öffentlicher Beschilderung veröffentlichen.',
      ],
    },
  ],
};
