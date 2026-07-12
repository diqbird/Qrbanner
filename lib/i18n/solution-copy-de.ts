import type { SolutionPage } from '@/lib/solutions';
import { SOLUTION_PLATFORM_FEATURES_DE } from './solution-sector-de';

/** Hand-curated German copy for high-traffic solution pages. */
export const SOLUTION_COPY_DE: Record<string, Partial<SolutionPage>> = {
  'restaurant-menu': {
    title: 'Restaurant-Menü-QR-Code',
    headline: 'Digitale Speisekarten vom Tisch aus scannen',
    description:
      'Ersetzen Sie Papier-Menüs durch einen dynamischen QR-Code. Preise, Allergene und Tagesgerichte ohne Neudruck aktualisieren.',
    metaDescription:
      'Restaurant-Menü-QR-Code für Tische und Theken erstellen. Menü online aktualisieren, Scans tracken. Kostenloser Generator mit Analysen.',
    keywords: ['Restaurant Menü QR-Code', 'digitale Speisekarte QR', 'Tisch QR Menü', 'Café Menü QR'],
    benefits: [
      'Preise und Specials sofort aktualisieren',
      'Menü-Aufrufe nach Standort und Uhrzeit tracken',
      'Funktioniert auf jedem Smartphone — keine App nötig',
      'Mittag-/Abend-Routing für unterschiedliche Menüs',
    ],
    features: [
      'Landingpage mit Menü-PDF oder Web-URL',
      'Passwortschutz für Personal-Menüs',
      'GA4 und Meta Pixel beim Scan',
      ...SOLUTION_PLATFORM_FEATURES_DE,
    ],
    steps: [
      { title: 'Restaurant-Vorlage wählen', description: 'Felder für Menü-URL, Lokalname und Wi‑Fi-Hinweise.' },
      { title: 'Menü-Link hinzufügen', description: 'Website, PDF oder Menüplattform verknüpfen.' },
      { title: 'Tischaufsteller drucken', description: 'PNG oder druckfertiges Banner herunterladen und aufstellen.' },
    ],
    faq: [
      {
        q: 'Kann ich denselben QR-Code an jedem Tisch nutzen?',
        a: 'Ja. Ein dynamischer Code funktioniert überall. Für detaillierte Analysen nutzen Sie zonenweise Codes.',
      },
      {
        q: 'Was, wenn sich das Menü täglich ändert?',
        a: 'Im Dashboard Ziel-URL oder PDF aktualisieren — das gedruckte QR-Muster bleibt gleich.',
      },
    ],
  },
  'business-card': {
    title: 'Digitale Visitenkarten-QR-Code',
    headline: 'Ein Scan speichert den Kontakt im Telefon',
    description:
      'Verwandeln Sie Ihre Visitenkarte in einen scannbaren QR-Code. Name, Telefon, E-Mail und Website landen mit einem Tippen.',
    metaDescription:
      'Digitale Visitenkarten-QR-Codes erstellen. Auf Karten, Badges und E-Mail-Signaturen teilen; Scans verfolgen.',
    keywords: ['Visitenkarte QR-Code', 'vCard QR Generator', 'digitale Visitenkarte QR'],
    benefits: [
      'Kein Tippen — Kontakt landet direkt im Telefon',
      'Daten ohne Neudruck aktualisieren',
      'Sehen, wie oft die Karte gescannt wird',
      'Bulk-Visitenkarten-QR für Teams',
    ],
    features: [
      'Kontakt speichern im vCard-Format',
      'Anpassung mit Logo und Markenfarben',
      'Scan-Analysen und Webhook-Benachrichtigungen',
      ...SOLUTION_PLATFORM_FEATURES_DE,
    ],
    steps: [
      { title: 'Visitenkarten-Vorlage öffnen', description: 'Name, Titel, Telefon und E-Mail ausfüllen.' },
      { title: 'Stil wählen', description: 'Farbe, Logo und Rahmen an Ihre Marke anpassen.' },
      { title: 'Auf Karten und Badges drucken', description: 'PNG laden oder Druckbanner exportieren.' },
    ],
    faq: [
      {
        q: 'Funktioniert es auf iPhone und Android?',
        a: 'Ja. vCard-QR-Codes öffnen die Kontaktspeicherung auf beiden Plattformen.',
      },
      {
        q: 'Muss ich bei Jobwechsel neu drucken?',
        a: 'Nein. Daten im Panel aktualisieren; derselbe QR bleibt aktuell.',
      },
    ],
  },
};
