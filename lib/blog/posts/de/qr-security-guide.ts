import type { BlogPost } from '../../types';

export const qrSecurityGuideDe: BlogPost = {
  slug: 'qr-code-security-best-practices',
  title: 'QR-Code-Sicherheit: Marke und Nutzer schützen',
  description:
    'QR-Phishing ist real. So sichern Sie dynamische QR-Kampagnen mit Passwortschutz, Domain-Vertrauen, Link-Monitoring und Mitarbeiterschulung.',
  keywords: ['QR-Code Sicherheit', 'QR-Phishing', 'sichere QR-Codes', 'dynamische QR-Sicherheit', 'QR-Betrug'],
  publishedAt: '2026-06-18',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Sicherheit',
  sections: [
    {
      type: 'p',
      content:
        'Angreifer können bösartige QR-Aufkleber über legitime kleben. Unternehmen müssen Kampagnen so gestalten, dass sie schwer zu manipulieren und für Kunden leicht vertrauenswürdig sind.',
    },
    {
      type: 'h2',
      content: 'Dynamische Weiterleitungen unter Ihrer Kontrolle',
    },
    {
      type: 'p',
      content:
        'Kurzlinks auf Ihrer eigenen Domain (oder der verifizierten QRbanner-Weiterleitung) lassen Sie Ziele ändern, wenn eine Partner-URL kompromittiert ist. Statische Codes mit Roh-URLs lassen sich ohne Neudruck nicht widerrufen.',
    },
    {
      type: 'h2',
      content: 'Risikoreiche Abläufe absichern',
    },
    {
      type: 'ul',
      items: [
        'Codes für interne Dokumente oder VIP-Angebote mit Passwort schützen.',
        'Ablaufdaten und Scan-Limits für Event-Tickets setzen.',
        'Eigene Scan-Domains nutzen, die zu Ihrer Marke passen (scan.ihre-marke.com).',
        'Plötzliche Scan-Spitzen überwachen — sie können auf Aufkleber-Betrug hinweisen.',
      ],
    },
    {
      type: 'h2',
      content: 'Team-Konten schützen',
    },
    {
      type: 'ul',
      items: [
        'TOTP-Zwei-Faktor-Authentifizierung in den Einstellungen für jeden Admin aktivieren.',
        'Business-Workspaces können SSO erzwingen und SAML mit erlaubten E-Mail-Domains konfigurieren.',
        'Webhook-Zustellprotokolle prüfen, wenn Scan-Daten QRbanner zu externen Systemen verlassen.',
      ],
    },
    {
      type: 'h2',
      content: 'Kundenaufklärung',
    },
    {
      type: 'p',
      content:
        'Schulen Sie Mitarbeitende, täglich auf überklebte Aufkleber zu prüfen. Platzieren Sie Ihr Logo neben gedruckten Codes. Auf Landingpages Markenfarben und das HTTPS-Schloss zeigen, bevor persönliche Daten abgefragt werden.',
    },
  ],
};
