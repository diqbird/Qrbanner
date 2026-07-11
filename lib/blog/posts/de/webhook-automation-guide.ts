import type { BlogPost } from '../../types';

export const webhookAutomationGuideDe: BlogPost = {
  slug: 'qr-scan-webhook-automation-guide',
  title: 'QR-Scan-Webhooks: Slack, Sheets und CRM aus jedem Scan automatisieren',
  description:
    'Schritt-für-Schritt-Anleitung zu HMAC-signierten QRbanner-Webhooks — Scans mit Zapier, Slack, Google Sheets, HubSpot und eigenen Backends verbinden.',
  keywords: ['QR Webhook', 'QR-Scan-Automatisierung', 'Zapier QR-Code', 'QRbanner Webhook', 'Scan API'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 7,
  author: 'QRbanner Team',
  category: 'Entwickler',
  sections: [
    {
      type: 'p',
      content:
        'Jeder Scan kann einen signierten Webhook-Payload mit QR-ID, Zeitstempel, Gerät und Geo-Feldern auslösen. Teams nutzen das, um Slack-Kanäle zu benachrichtigen, Google-Sheets-Zeilen anzuhängen oder CRM-Leads in Echtzeit zu aktualisieren.',
    },
    {
      type: 'h2',
      content: 'Einrichtung in drei Schritten',
    },
    {
      type: 'ul',
      items: [
        'Einstellungen → Webhooks → Endpoint hinzufügen und Signing Secret kopieren',
        'HMAC-Signaturen auf Ihrem Server prüfen oder Zapier Catch Hook nutzen',
        'Felder Ihrer Aktion zuordnen — Slack-Nachricht, Sheet-Zeile oder CRM-Update',
      ],
    },
    {
      type: 'h2',
      content: 'Zapier und No-Code',
    },
    {
      type: 'p',
      content:
        'Siehe /integrations/zapier für einen visuellen Walkthrough. Für eigene Apps kombinieren Sie Webhooks mit unserer REST-API unter /developers.',
    },
    {
      type: 'h2',
      content: 'Delivery-Logs und Debugging',
    },
    {
      type: 'p',
      content:
        'Einstellungen → Scan Webhooks zeigt aktuelle Zustellversuche mit HTTP-Statuscodes. So debuggen Sie Zapier oder eigene Endpoints, ohne zu raten, ob Scans Ihren Stack erreicht haben.',
    },
    {
      type: 'h2',
      content: 'Tipps zur Zuverlässigkeit',
    },
    {
      type: 'p',
      content:
        'Antworten Sie schnell mit 2xx und verarbeiten Sie asynchron. Fehlgeschlagene Zustellungen wiederholen wir mit exponentiellem Backoff. Filtern Sie Webhooks pro QR oder Kampagne, um Rauschen bei stark frequentierten Codes zu reduzieren.',
    },
  ],
};
