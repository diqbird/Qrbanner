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
};
