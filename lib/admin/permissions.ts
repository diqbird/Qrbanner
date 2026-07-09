import type { AdminPermission, AdminRole } from './types';

const ADMIN_PERMISSIONS: AdminPermission[] = [
  'admin.dashboard',
  'admin.users',
  'admin.workspaces',
  'admin.plans',
  'admin.payments',
  'admin.qr',
  'admin.menus',
  'admin.banners',
  'admin.campaigns',
  'admin.ai',
  'admin.media',
  'admin.blog',
  'admin.notifications',
  'admin.support',
  'admin.studio',
  'admin.analytics',
  'admin.webhooks',
  'admin.settings',
  'admin.roles',
  'admin.audit',
  'admin.security',
  'admin.backup',
];

const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  admin: ADMIN_PERMISSIONS,
  user: [],
};

export function hasAdminPermission(role: string | undefined | null, permission: AdminPermission): boolean {
  if (role !== 'admin') return false;
  return ROLE_PERMISSIONS.admin.includes(permission);
}

export function isAdminRole(role: string | undefined | null): role is AdminRole {
  return role === 'admin';
}
