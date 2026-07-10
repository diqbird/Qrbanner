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
    webhookHint: 'Use Zapier "Webhooks by Zapier" → Catch Hook as your endpoint URL.',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    descriptionKey: 'settings.integrations.hubspotPresetDesc',
    docsPath: '/integrations/hubspot',
    webhookHint: 'Map scan fields to HubSpot contact properties.',
  },
  {
    id: 'make',
    name: 'Make',
    descriptionKey: 'settings.integrations.makePresetDesc',
    docsPath: '/integrations/make',
    webhookHint: 'Create a Make scenario with a Custom Webhook module.',
  },
];

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
};
