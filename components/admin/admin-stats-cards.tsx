'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, QrCode, ScanLine, Crown } from 'lucide-react';
import type { AdminContentState } from '@/hooks/use-admin-content';

type AdminStatsCardsProps = {
  admin: AdminContentState;
};

export function AdminStatsCards({ admin }: AdminStatsCardsProps) {
  const { t, stats } = admin;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" /> {t('admin.totalMembers')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold font-display">{stats?.totalUsers ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('admin.last7Days', { count: stats?.signupsLast7Days ?? 0 })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Crown className="h-4 w-4" /> {t('admin.premiumTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold font-display">{stats?.premiumUsers ?? 0}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('admin.premiumBreakdown', {
              pro: stats?.planCounts.pro ?? 0,
              business: stats?.planCounts.business ?? 0,
              agency: stats?.planCounts.agency ?? 0,
            })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <QrCode className="h-4 w-4" /> {t('admin.qrCodes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold font-display">{stats?.qrTotal ?? 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ScanLine className="h-4 w-4" /> {t('admin.totalScans')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold font-display">{stats?.scanTotal ?? 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
