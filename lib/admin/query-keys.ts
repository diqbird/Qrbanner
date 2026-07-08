export const adminQueryKeys = {
  all: ['admin'] as const,
  stats: () => [...adminQueryKeys.all, 'stats'] as const,
  health: () => [...adminQueryKeys.all, 'health'] as const,
  users: (params: Record<string, string | number | undefined>) =>
    [...adminQueryKeys.all, 'users', params] as const,
  workspaces: (params: Record<string, string | number | undefined>) =>
    [...adminQueryKeys.all, 'workspaces', params] as const,
  qr: (params: Record<string, string | number | undefined>) =>
    [...adminQueryKeys.all, 'qr', params] as const,
  payments: () => [...adminQueryKeys.all, 'payments'] as const,
  webhooks: () => [...adminQueryKeys.all, 'webhooks'] as const,
  analytics: () => [...adminQueryKeys.all, 'analytics'] as const,
  audit: (params: Record<string, string | number | undefined>) =>
    [...adminQueryKeys.all, 'audit', params] as const,
  menus: (params: Record<string, string | number | undefined>) =>
    [...adminQueryKeys.all, 'menus', params] as const,
  campaigns: () => [...adminQueryKeys.all, 'campaigns'] as const,
  banners: () => [...adminQueryKeys.all, 'banners'] as const,
  ai: () => [...adminQueryKeys.all, 'ai'] as const,
  notifications: () => [...adminQueryKeys.all, 'notifications'] as const,
  support: (params: Record<string, string | number | undefined>) =>
    [...adminQueryKeys.all, 'support', params] as const,
  backup: () => [...adminQueryKeys.all, 'backup'] as const,
};
