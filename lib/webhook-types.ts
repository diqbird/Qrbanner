export interface WebhookRow {
  id: string;
  url: string;
  label: string | null;
  enabled: boolean;
  createdAt: string;
}

export interface DeliveryRow {
  id: string;
  endpointId: string;
  endpointUrl: string | null;
  endpointLabel: string | null;
  event: string;
  statusCode: number | null;
  success: boolean;
  error: string | null;
  durationMs: number | null;
  attempt: number;
  canRetry: boolean;
  createdAt: string;
}

export type WebhooksData = {
  webhooks: WebhookRow[];
  limit: number;
};

export function parseWebhooks(json: unknown): WebhooksData {
  const data = json as Record<string, unknown>;
  return {
    webhooks: (data.webhooks as WebhookRow[]) ?? [],
    limit: Number(data.limit ?? 2),
  };
}
