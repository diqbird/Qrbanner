import type { BlogPost } from '../../types';

export const referralProgramGuideDe: BlogPost = {
  slug: 'qrbanner-referral-program-guide',
  title: 'QRbanner-Empfehlungsprogramm: Links teilen, Anmeldungen tracken, Prämien einlösen',
  description:
    'So funktioniert das QRbanner-Empfehlungsprogramm — persönliche Links, OAuth- und E-Mail-Anmeldungen mit ?ref=, Meilenstein-Vorteile und Pro-Trial-Credits bei 5 Empfehlungen.',
  keywords: ['QRbanner Empfehlung', 'QR Empfehlungsprogramm', 'SaaS Empfehlungslink', 'dynamischer QR Affiliate'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Produkt',
  sections: [
    {
      type: 'p',
      content:
        'Jedes QRbanner-Konto enthält einen persönlichen Empfehlungslink unter Einstellungen → Empfehlungsprogramm. Teilen Sie ihn mit Kolleginnen, Kunden oder Ihrem Publikum — Anmeldungen mit ?ref=YOURCODE zählen zu Ihren Statistiken.',
    },
    {
      type: 'h2',
      content: 'E-Mail- und OAuth-Anmeldungen',
    },
    {
      type: 'ul',
      items: [
        'E-Mail-Anmeldung: ?ref=CODE an /signup anhängen — der Code wird bei der Registrierung gespeichert.',
        'Google, GitHub oder Microsoft: Derselbe ?ref=-Link setzt ein kurzlebiges Cookie, sodass OAuth-Anmeldungen Ihnen weiterhin gutgeschrieben werden.',
        'Empfehlungen gelten einmalig pro neuem Konto — doppelte Anmeldungen blähen die Zähler nicht auf.',
      ],
    },
    {
      type: 'h2',
      content: 'Meilensteine und Pro-Trial-Credit',
    },
    {
      type: 'p',
      content:
        'Verfolgen Sie den Fortschritt bei 1, 3, 5 und 10 verifizierten Anmeldungen. Bei fünf Empfehlungen können Sie ein kostenloses Pro-Plan-Upgrade einlösen. Agency-Partner mit zehn Anmeldungen können für eine Partner-Prüfung infrage kommen.',
    },
    {
      type: 'h2',
      content: 'Tipps für Agenturen',
    },
    {
      type: 'p',
      content:
        'Kombinieren Sie Ihren Empfehlungslink mit Case Studies und dem ROI-Rechner bei Kundengesprächen. White-Label-Landingpages auf Business- und Agency-Plänen machen Übergaben professionell, während Empfehlungen Ihre Kontovorteile steigern.',
    },
  ],
};
