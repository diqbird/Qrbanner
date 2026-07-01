'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, QrCode, ScanLine, Crown, UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { PLANS } from '@/lib/plans';
import { AdminBlogPanel } from '@/components/admin/admin-blog-panel';
import { AdminBillingPanel } from '@/components/admin/admin-billing-panel';
import { AdminAuditPanel } from '@/components/admin/admin-audit-panel';
import { AdminSiteSettings } from '@/components/admin/admin-site-settings';
import { MediaLibraryCard } from '@/components/dashboard/media-library-card';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveApiError } from '@/lib/i18n/resolve-api-error';

import type { AdminPlanCounts } from '@/lib/admin-billing-stats';

interface Stats {
  totalUsers: number;
  planCounts: AdminPlanCounts;
  qrTotal: number;
  scanTotal: number;
  signupsLast7Days: number;
  premiumUsers: number;
  stripeSubscribers: number;
  estimatedMrr: number;
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  role: string;
  createdAt: string;
  emailVerified: boolean;
  qrCount: number;
  billingStatus: 'free' | 'stripe' | 'manual';
}

export function AdminContent() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (planFilter !== 'all') params.set('plan', planFilter);

      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/users?${params}`),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users ?? []);
      }
    } catch {
      toast.error(t('admin.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [search, planFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateUser = async (userId: string, patch: { plan?: string; role?: string }) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...patch }),
    });
    if (res.ok) {
      toast.success(t('admin.userUpdated'));
      fetchData();
    } else {
      const err = await res.json();
      toast.error(resolveApiError(t, err?.error, 'admin.updateFailed'));
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> {t('admin.title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('admin.subtitle')}
        </p>
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
        {t('admin.launchBanner')}
      </div>

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

      {stats ? (
        <AdminBillingPanel
          planCounts={stats.planCounts}
          estimatedMrr={stats.estimatedMrr}
          stripeSubscribers={stats.stripeSubscribers}
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> {t('admin.membersTitle')}
          </CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-2">
            <Input
              placeholder={t('admin.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder={t('admin.allPlans')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.allPlans')}</SelectItem>
                <SelectItem value="free">{t('admin.planFree')}</SelectItem>
                <SelectItem value="pro">{t('admin.planPro')}</SelectItem>
                <SelectItem value="business">{t('admin.planBusiness')}</SelectItem>
                <SelectItem value="agency">{t('admin.planAgency')}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => fetchData()}>
              {t('admin.refresh')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.memberCol')}</TableHead>
                <TableHead>{t('admin.planCol')}</TableHead>
                <TableHead>{t('admin.billingCol')}</TableHead>
                <TableHead>{t('admin.roleCol')}</TableHead>
                <TableHead>{t('admin.qrsCol')}</TableHead>
                <TableHead>{t('admin.joinedCol')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {t('admin.noMembers')}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{u.name || '—'}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                        {!u.emailVerified && (
                          <Badge variant="outline" className="mt-1 text-[10px]">{t('admin.unverified')}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.plan}
                        onValueChange={(plan) => updateUser(u.id, { plan })}
                      >
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PLANS).map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.billingStatus === 'stripe' ? 'secondary' : 'outline'}
                        className="text-[10px] font-normal"
                      >
                        {u.billingStatus === 'stripe'
                          ? t('admin.billingStripe')
                          : u.billingStatus === 'manual'
                            ? t('admin.billingManual')
                            : t('admin.billingFree')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.role}
                        onValueChange={(role) => updateUser(u.id, { role })}
                      >
                        <SelectTrigger className="h-8 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">{t('admin.roleUser')}</SelectItem>
                          <SelectItem value="admin">{t('admin.roleAdmin')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{u.qrCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AdminSiteSettings />
      <AdminAuditPanel />
      <AdminBlogPanel />
      <MediaLibraryCard />
    </div>
  );
}
