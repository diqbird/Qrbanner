import type { LucideIcon } from 'lucide-react';

export type AdminRole = 'admin' | 'user';

export type AdminModuleId =
  | 'dashboard'
  | 'users'
  | 'workspaces'
  | 'plans'
  | 'payments'
  | 'qr'
  | 'menus'
  | 'banners'
  | 'campaigns'
  | 'ai'
  | 'media'
  | 'blog'
  | 'notifications'
  | 'support'
  | 'analytics'
  | 'webhooks'
  | 'settings'
  | 'roles'
  | 'audit'
  | 'security'
  | 'backup';

export type AdminModuleStatus = 'live' | 'beta' | 'planned';

export interface AdminModuleDef {
  id: AdminModuleId;
  href: string;
  icon: LucideIcon;
  labelKey: string;
  groupKey: string;
  status: AdminModuleStatus;
  permission: AdminPermission;
}

export type AdminPermission =
  | 'admin.dashboard'
  | 'admin.users'
  | 'admin.workspaces'
  | 'admin.plans'
  | 'admin.payments'
  | 'admin.qr'
  | 'admin.menus'
  | 'admin.banners'
  | 'admin.campaigns'
  | 'admin.ai'
  | 'admin.media'
  | 'admin.blog'
  | 'admin.notifications'
  | 'admin.support'
  | 'admin.analytics'
  | 'admin.webhooks'
  | 'admin.settings'
  | 'admin.roles'
  | 'admin.audit'
  | 'admin.security'
  | 'admin.backup';

export type AdminWidgetId =
  | 'stats'
  | 'billing'
  | 'signups-chart'
  | 'plan-chart'
  | 'recent-audit'
  | 'system-health';

export interface AdminDashboardWidget {
  id: AdminWidgetId;
  labelKey: string;
  defaultOrder: number;
  defaultVisible: boolean;
}
