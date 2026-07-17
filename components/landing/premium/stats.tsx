import { getPublicPlatformStats, shouldDisplayPublicStats } from '@/lib/public-stats';
import { PremiumStatsClient } from './stats-client';

export async function PremiumStats() {
  const stats = await getPublicPlatformStats();
  if (!shouldDisplayPublicStats(stats)) return null;
  return <PremiumStatsClient stats={stats} />;
}
