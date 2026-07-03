/**
 * Plan-based API rate limiting for the public REST API.
 *
 * Two independent limits (Bitly-style):
 *   1. Per-minute burst limit  → abuse / DDoS protection (all plans).
 *   2. Monthly quota           → plan differentiation, resets on the 1st.
 *
 * Backed by checkRateLimit() (Redis when REDIS_URL is set, in-memory fallback).
 */

import { checkRateLimit, peekRateLimit } from '@/lib/rate-limit-store';
import type { PlanLimits } from '@/lib/plans';

export interface ApiRateLimitResult {
  ok: boolean;
  scope?: 'minute' | 'month';
  /** Seconds until the exhausted window resets. */
  retryAfter?: number;
  headers: Record<string, string>;
}

function monthKey(now: Date): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

function msUntilMonthEnd(now: Date): number {
  const nextMonth = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0);
  return Math.max(1000, nextMonth - now.getTime());
}

export interface ApiUsage {
  perMinuteLimit: number;
  monthlyQuota: number;
  monthlyUsed: number;
  monthlyRemaining: number;
  /** Unix seconds when the monthly quota resets. */
  monthlyResetAt: number;
}

/** Read current monthly API usage without consuming quota. */
export async function getApiUsage(userId: string, plan: PlanLimits): Promise<ApiUsage> {
  const now = new Date();
  const month = await peekRateLimit(
    `apimonth:${userId}:${monthKey(now)}`,
    plan.apiMonthlyQuota,
    msUntilMonthEnd(now)
  );
  return {
    perMinuteLimit: plan.apiRateLimitPerMin,
    monthlyQuota: plan.apiMonthlyQuota,
    monthlyUsed: month.count,
    monthlyRemaining: month.remaining,
    monthlyResetAt: Math.ceil(month.resetAt / 1000),
  };
}

export async function enforceApiRateLimit(
  userId: string,
  plan: PlanLimits
): Promise<ApiRateLimitResult> {
  const now = new Date();

  // 1. Per-minute burst limit.
  const minute = await checkRateLimit(`apimin:${userId}`, plan.apiRateLimitPerMin, 60_000);
  if (!minute.ok) {
    const retryAfter = Math.max(1, Math.ceil((minute.resetAt - Date.now()) / 1000));
    return {
      ok: false,
      scope: 'minute',
      retryAfter,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(plan.apiRateLimitPerMin),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(minute.resetAt / 1000)),
      },
    };
  }

  // 2. Monthly quota (per calendar month, auto-resets via month-scoped key).
  const month = await checkRateLimit(
    `apimonth:${userId}:${monthKey(now)}`,
    plan.apiMonthlyQuota,
    msUntilMonthEnd(now)
  );
  if (!month.ok) {
    const retryAfter = Math.max(1, Math.ceil((month.resetAt - Date.now()) / 1000));
    return {
      ok: false,
      scope: 'month',
      retryAfter,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(plan.apiRateLimitPerMin),
        'X-RateLimit-Remaining': String(minute.remaining),
        'X-RateLimit-Reset': String(Math.ceil(minute.resetAt / 1000)),
        'X-RateLimit-Quota': String(plan.apiMonthlyQuota),
        'X-RateLimit-Quota-Remaining': '0',
        'X-RateLimit-Quota-Reset': String(Math.ceil(month.resetAt / 1000)),
      },
    };
  }

  return {
    ok: true,
    headers: {
      'X-RateLimit-Limit': String(plan.apiRateLimitPerMin),
      'X-RateLimit-Remaining': String(minute.remaining),
      'X-RateLimit-Reset': String(Math.ceil(minute.resetAt / 1000)),
      'X-RateLimit-Quota': String(plan.apiMonthlyQuota),
      'X-RateLimit-Quota-Remaining': String(month.remaining),
      'X-RateLimit-Quota-Reset': String(Math.ceil(month.resetAt / 1000)),
    },
  };
}
