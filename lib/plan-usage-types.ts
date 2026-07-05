export interface PlanUsageResponse {
  plan: { id: string; name: string; priceLabel: string };
  trial?: {
    eligible: boolean;
    active: boolean;
    daysLeft: number;
    expiresAt: string | null;
  };
  usage: {
    qrCodes: number;
    qrLimit: number;
    customDomains: number;
    domainLimit: number;
    bulkRowLimit: number;
    webhooks: number;
    webhookLimit: number;
    automations: number;
    automationLimit: number;
    styleTemplates: number;
    styleTemplateLimit: number;
  };
}
