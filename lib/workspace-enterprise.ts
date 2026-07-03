import { getPlanLimits } from '@/lib/plans';

export function workspaceOwnerHasEnterprisePlan(plan: string | null | undefined): boolean {
  return plan === 'business' || plan === 'agency';
}

export function workspaceOwnerHasResellerPlan(plan: string | null | undefined): boolean {
  return plan === 'agency';
}

export function getResellerClientLimit(plan: string | null | undefined): number {
  return getPlanLimits(plan).maxResellerClients;
}

export const ENTERPRISE_SMTP_SCOPE = 'tenant-smtp';
