import type { BlogPost } from '../../types';

export const customScanDomainGuideDe: BlogPost = {
  slug: 'custom-scan-domain-setup-guide',
  title: 'Eigene Scan-Domains: QR-Links mit scan.ihre-marke.com branden',
  description:
    'So zeigen Sie eine eigene Scan-Subdomain auf QRbanner für gebrandete Kurzlinks auf Speisekarten, Verpackung und Kampagnen — im Free-Plan inklusive.',
  keywords: ['eigene QR-Domain', 'gebrandeter QR-Link', 'Scan-Subdomain', 'White-Label QR-URL', 'QRbanner Domain'],
  publishedAt: '2026-06-29',
  updatedAt: '2026-06-29',
  readingMinutes: 6,
  author: 'QRbanner Team',
  category: 'Anleitung',
  sections: [
    {
      type: 'p',
      content:
        'Standard-Kurzlinks funktionieren überall — Marken wollen aber scan.ihre-marke.com auf Verpackung und Speisekarten. Mit QRbanner fügen Sie eine eigene Scan-Domain schon im Free-Plan hinzu — Besucher sehen Ihren Hostnamen bei jeder Weiterleitung.',
    },
    {
      type: 'h2',
      content: 'Setup-Checkliste',
    },
    {
      type: 'ul',
      items: [
        'Subdomain wählen (z. B. scan.acme.com oder qr.acme.com)',
        'Den von QRbanner bereitgestellten CNAME-Eintrag in Ihrer DNS setzen',
        'Domain unter Einstellungen → Eigene Domains verifizieren',
        'Bestehende dynamische Codes nutzen automatisch den gebrandeten Host',
      ],
    },
    {
      type: 'h2',
      content: 'Tipp für Agenturen',
    },
    {
      type: 'p',
      content:
        'Agenturen hinterlegen auf Business- und Agency-Plänen eine Domain pro Kunden. Kombinieren Sie das mit ausgeblendetem Powered-by auf Landingpages für vollständige White-Label-Lieferung.',
    },
  ],
};
