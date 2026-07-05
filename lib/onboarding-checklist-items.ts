import { Download, BarChart3, Globe, Code2, Users } from 'lucide-react';

export const ONBOARDING_CHECKLIST_STORAGE_KEY = 'qrb_onboarding_checklist_dismissed';
export const ONBOARDING_CHECKLIST_PROGRESS_KEY = 'qrb_onboarding_checklist_progress';

export const ONBOARDING_CHECKLIST_ITEMS = [
  { key: 'checklist.download', href: '/qr/create?quick=1', icon: Download },
  { key: 'checklist.analytics', href: '/dashboard', icon: BarChart3 },
  { key: 'checklist.domain', href: '/settings', icon: Globe },
  { key: 'checklist.api', href: '/developers', icon: Code2 },
  { key: 'checklist.team', href: '/settings', icon: Users },
] as const;
