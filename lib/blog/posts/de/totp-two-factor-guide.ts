import type { BlogPost } from '../../types';

export const totpTwoFactorGuideDe: BlogPost = {
  slug: 'qr-account-two-factor-authentication',
  title: 'QRbanner-Konto mit Zwei-Faktor-Authentifizierung absichern',
  description:
    'TOTP-Authenticator-Apps in QRbanner aktivieren — zum Schutz von Dashboards, API-Keys und Billing. Praktische Einrichtung für Teams.',
  keywords: ['Zwei-Faktor-Authentifizierung', 'TOTP QR-Code', 'QRbanner Sicherheit', 'Authenticator-App'],
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-01',
  readingMinutes: 5,
  author: 'QRbanner Team',
  category: 'Sicherheit',
  sections: [
    {
      type: 'p',
      content:
        'QR-Codes steuern oft Menüs, Zahlungen und interne Dokumente. Das Konto, das diese Codes verwaltet, sollte mindestens so geschützt sein wie Ihre E-Mail. QRbanner unterstützt TOTP-Zwei-Faktor-Authentifizierung in jedem Plan.',
    },
    {
      type: 'h2',
      content: 'Warum 2FA für die QR-Verwaltung?',
    },
    {
      type: 'ul',
      items: [
        'Verhindert Übernahmen bei wiederverwendetem oder gephishtem Passwort.',
        'Schützt API-Keys, Webhooks und Billing-Einstellungen.',
        'Ergänzt Business-Workspace-SSO/SAML für größere Teams.',
      ],
    },
    {
      type: 'h2',
      content: 'Einrichtung in unter zwei Minuten',
    },
    {
      type: 'ul',
      items: [
        'Dashboard → Einstellungen → Zwei-Faktor-Authentifizierung öffnen.',
        'QR-Code mit Google Authenticator, 1Password oder Authy scannen.',
        '6-stelligen Code zur Bestätigung eingeben und Backup-Codes sicher aufbewahren.',
      ],
    },
    {
      type: 'h2',
      content: 'Tipps für die Team-Einführung',
    },
    {
      type: 'p',
      content:
        'Admins und Workspace-Owner zuerst zur 2FA verpflichten. Mit SAML in Business-Plänen kombinieren, damit Mitarbeitende über Okta oder Azure AD anmelden — und Authenticator-Apps für sensible Aktionen nutzen.',
    },
  ],
};
