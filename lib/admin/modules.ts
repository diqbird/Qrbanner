import {
  BarChart3,
  Bell,
  Bot,
  CreditCard,
  Database,
  FileText,
  FolderOpen,
  Headphones,
  Image,
  KeyRound,
  LayoutDashboard,
  Megaphone,
  Menu,
  Package,
  QrCode,
  ScrollText,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Webhook,
  Building2,
} from 'lucide-react';
import type { AdminDashboardWidget, AdminModuleDef } from './types';

export const ADMIN_MODULES: AdminModuleDef[] = [
  { id: 'dashboard', href: '/admin', icon: LayoutDashboard, labelKey: 'superAdmin.nav.dashboard', groupKey: 'superAdmin.groups.overview', status: 'live', permission: 'admin.dashboard' },
  { id: 'analytics', href: '/admin/analytics', icon: BarChart3, labelKey: 'superAdmin.nav.analytics', groupKey: 'superAdmin.groups.overview', status: 'live', permission: 'admin.analytics' },
  { id: 'users', href: '/admin/users', icon: Users, labelKey: 'superAdmin.nav.users', groupKey: 'superAdmin.groups.accounts', status: 'live', permission: 'admin.users' },
  { id: 'workspaces', href: '/admin/workspaces', icon: Building2, labelKey: 'superAdmin.nav.workspaces', groupKey: 'superAdmin.groups.accounts', status: 'live', permission: 'admin.workspaces' },
  { id: 'roles', href: '/admin/roles', icon: KeyRound, labelKey: 'superAdmin.nav.roles', groupKey: 'superAdmin.groups.accounts', status: 'live', permission: 'admin.roles' },
  { id: 'plans', href: '/admin/plans', icon: Package, labelKey: 'superAdmin.nav.plans', groupKey: 'superAdmin.groups.billing', status: 'live', permission: 'admin.plans' },
  { id: 'payments', href: '/admin/payments', icon: CreditCard, labelKey: 'superAdmin.nav.payments', groupKey: 'superAdmin.groups.billing', status: 'live', permission: 'admin.payments' },
  { id: 'qr', href: '/admin/qr', icon: QrCode, labelKey: 'superAdmin.nav.qr', groupKey: 'superAdmin.groups.content', status: 'live', permission: 'admin.qr' },
  { id: 'menus', href: '/admin/menus', icon: Menu, labelKey: 'superAdmin.nav.menus', groupKey: 'superAdmin.groups.content', status: 'live', permission: 'admin.menus' },
  { id: 'banners', href: '/admin/banners', icon: Image, labelKey: 'superAdmin.nav.banners', groupKey: 'superAdmin.groups.content', status: 'live', permission: 'admin.banners' },
  { id: 'campaigns', href: '/admin/campaigns', icon: Megaphone, labelKey: 'superAdmin.nav.campaigns', groupKey: 'superAdmin.groups.content', status: 'live', permission: 'admin.campaigns' },
  { id: 'ai', href: '/admin/ai', icon: Bot, labelKey: 'superAdmin.nav.ai', groupKey: 'superAdmin.groups.content', status: 'live', permission: 'admin.ai' },
  { id: 'media', href: '/admin/media', icon: FolderOpen, labelKey: 'superAdmin.nav.media', groupKey: 'superAdmin.groups.content', status: 'live', permission: 'admin.media' },
  { id: 'blog', href: '/admin/blog', icon: FileText, labelKey: 'superAdmin.nav.blog', groupKey: 'superAdmin.groups.content', status: 'live', permission: 'admin.blog' },
  { id: 'notifications', href: '/admin/notifications', icon: Bell, labelKey: 'superAdmin.nav.notifications', groupKey: 'superAdmin.groups.communications', status: 'live', permission: 'admin.notifications' },
  { id: 'support', href: '/admin/support', icon: Headphones, labelKey: 'superAdmin.nav.support', groupKey: 'superAdmin.groups.communications', status: 'live', permission: 'admin.support' },
  { id: 'studio', href: '/admin/studio', icon: Sparkles, labelKey: 'superAdmin.nav.studio', groupKey: 'superAdmin.groups.communications', status: 'live', permission: 'admin.studio' },
  { id: 'webhooks', href: '/admin/webhooks', icon: Webhook, labelKey: 'superAdmin.nav.webhooks', groupKey: 'superAdmin.groups.platform', status: 'live', permission: 'admin.webhooks' },
  { id: 'settings', href: '/admin/settings', icon: Settings, labelKey: 'superAdmin.nav.settings', groupKey: 'superAdmin.groups.platform', status: 'live', permission: 'admin.settings' },
  { id: 'audit', href: '/admin/audit', icon: ScrollText, labelKey: 'superAdmin.nav.audit', groupKey: 'superAdmin.groups.platform', status: 'live', permission: 'admin.audit' },
  { id: 'security', href: '/admin/security', icon: ShieldCheck, labelKey: 'superAdmin.nav.security', groupKey: 'superAdmin.groups.platform', status: 'live', permission: 'admin.security' },
  { id: 'backup', href: '/admin/backup', icon: Database, labelKey: 'superAdmin.nav.backup', groupKey: 'superAdmin.groups.platform', status: 'live', permission: 'admin.backup' },
];

export const ADMIN_DASHBOARD_WIDGETS: AdminDashboardWidget[] = [
  { id: 'stats', labelKey: 'superAdmin.widgets.stats', defaultOrder: 0, defaultVisible: true },
  { id: 'billing', labelKey: 'superAdmin.widgets.billing', defaultOrder: 1, defaultVisible: true },
  { id: 'signups-chart', labelKey: 'superAdmin.widgets.signupsChart', defaultOrder: 2, defaultVisible: true },
  { id: 'plan-chart', labelKey: 'superAdmin.widgets.planChart', defaultOrder: 3, defaultVisible: true },
  { id: 'recent-audit', labelKey: 'superAdmin.widgets.recentAudit', defaultOrder: 4, defaultVisible: true },
  { id: 'system-health', labelKey: 'superAdmin.widgets.systemHealth', defaultOrder: 5, defaultVisible: true },
];

export function groupAdminModules(modules: AdminModuleDef[]) {
  const groups = new Map<string, AdminModuleDef[]>();
  for (const mod of modules) {
    const list = groups.get(mod.groupKey) ?? [];
    list.push(mod);
    groups.set(mod.groupKey, list);
  }
  return groups;
}

export function findAdminModule(pathname: string): AdminModuleDef | undefined {
  const normalized = pathname.replace(/\/$/, '') || '/admin';
  return ADMIN_MODULES.find((m) => {
    if (m.href === '/admin') return normalized === '/admin';
    return normalized === m.href || normalized.startsWith(`${m.href}/`);
  });
}
