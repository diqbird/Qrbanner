import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, PlusCircle, Settings, FileSpreadsheet,
} from 'lucide-react';

export type DashboardNavItem = {
  href: string;
  key: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: '/dashboard', key: 'dashboard.title', icon: LayoutDashboard },
  { href: '/qr/create?quick=1', key: 'dashboard.createQr', icon: PlusCircle },
  { href: '/qr/bulk', key: 'dashboard.bulkImport', icon: FileSpreadsheet },
  { href: '/settings', key: 'dashboard.settings', icon: Settings },
];
