export type IntegrationPresetId = 'zapier' | 'hubspot' | 'make';

export type IntegrationPreset = {
  id: IntegrationPresetId;
  name: string;
  descriptionKey: string;
  docsPath: string;
  webhookHint: string;
};

export const INTEGRATION_PRESETS: IntegrationPreset[] = [
  {
    id: 'zapier',
    name: 'Zapier',
    descriptionKey: 'settings.integrations.zapierPresetDesc',
    docsPath: '/integrations/zapier',
    webhookHint: 'Zapier → Webhooks by Zapier → Catch Hook. Paste the Catch Hook URL as your QRbanner scan webhook endpoint.',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    descriptionKey: 'settings.integrations.hubspotPresetDesc',
    docsPath: '/integrations/hubspot',
    webhookHint:
      'Catch Hook → HubSpot Create/Update Contact. Map scan.city → city, scan.country → country, qr_name → notes.',
  },
  {
    id: 'make',
    name: 'Make',
    descriptionKey: 'settings.integrations.makePresetDesc',
    docsPath: '/integrations/make',
    webhookHint: 'Make → Custom Webhook module. Use the webhook URL as the QRbanner endpoint, then branch on event = scan.',
  },
];

/** Canonical sample payload for docs + dashboard presets. */
export const SCAN_WEBHOOK_SAMPLE = {
  event: 'scan',
  qr_code_id: 'clxxx',
  qr_name: 'Summer Campaign',
  short_code: 'abc123',
  scan: {
    country: 'US',
    city: 'New York',
    device: 'mobile',
    browser: 'Chrome',
    os: 'iOS',
    scanned_at: '2026-07-10T12:00:00.000Z',
  },
} as const;

export const HUBSPOT_FIELD_MAP: { webhook: string; hubspot: string }[] = [
  { webhook: 'qr_name', hubspot: 'notes / deal name' },
  { webhook: 'short_code', hubspot: 'custom property (optional)' },
  { webhook: 'scan.city', hubspot: 'city' },
  { webhook: 'scan.country', hubspot: 'country' },
  { webhook: 'scan.device', hubspot: 'notes (device)' },
  { webhook: 'scan.scanned_at', hubspot: 'last activity date' },
];

export function scanWebhookSampleJson(indent = 2): string {
  return JSON.stringify(SCAN_WEBHOOK_SAMPLE, null, indent);
}
