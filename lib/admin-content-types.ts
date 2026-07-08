import type { AdminPlanCounts } from '@/lib/admin-billing-stats';

export interface AdminStats {
  totalUsers: number;
  planCounts: AdminPlanCounts;
  qrTotal: number;
  scanTotal: number;
  signupsLast7Days: number;
  premiumUsers: number;
  paddleSubscribers: number;
  estimatedMrr: number;
  signupsByDay?: { day: string; count: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  role: string;
  createdAt: string;
  emailVerified: boolean;
  qrCount: number;
  billingStatus: 'free' | 'paddle' | 'manual';
}
