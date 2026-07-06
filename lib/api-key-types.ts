export const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'https://qrbanner.com';

export interface ApiUsageState {
  perMinuteLimit: number;
  monthlyQuota: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  monthlyResetAt: number;
}

export type ApiKeyStatus = {
  hasKey: boolean;
  prefix: string | null;
  createdAt: string | null;
  planId: string | null;
  planName: string | null;
  usage: ApiUsageState | null;
};

export function parseApiKeyStatus(json: unknown): ApiKeyStatus {
  const data = json as Record<string, unknown>;
  const usage = data.usage as Record<string, number> | undefined;
  return {
    hasKey: Boolean(data.has_key),
    prefix: (data.prefix as string | null) ?? null,
    createdAt: (data.created_at as string | null) ?? null,
    planId: (data.plan as string | null) ?? null,
    planName: (data.plan_name as string | null) ?? null,
    usage: usage
      ? {
          perMinuteLimit: usage.per_minute_limit,
          monthlyQuota: usage.monthly_quota,
          monthlyUsed: usage.monthly_used,
          monthlyRemaining: usage.monthly_remaining,
          monthlyResetAt: usage.monthly_reset_at,
        }
      : null,
  };
}
