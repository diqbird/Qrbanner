'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
} from 'recharts';
import {
  TrendingUp, Globe, Smartphone, Users, Clock, MapPin, Radio, Download, AlertCircle, BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadAnalyticsCsv } from '@/lib/analytics-export';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/i18n/language-provider';

interface DashboardAnalytics {
  totalScans: number;
  uniqueScans: number;
  todayScans: number;
  last7Days: number;
  scansByDay: { date: string; count: number }[];
  scansByCountry: { name: string; value: number }[];
  scansByCity: { name: string; value: number }[];
  recentScans: {
    country: string;
    city: string | null;
    device: string;
    browser: string;
    os: string;
    scannedAt: string;
    qrName: string | null;
  }[];
}

interface TopQR {
  id: string;
  name: string;
  totalScans: number;
  isActive: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function DashboardAnalyticsPanel() {
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [topQRCodes, setTopQRCodes] = useState<TopQR[]>([]);
  const [retentionCutoff, setRetentionCutoff] = useState<string | null>(null);
  const [planName, setPlanName] = useState('Free');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      setFetchError(false);
      const params = new URLSearchParams();
      if (dateRange.from) params.set('from', dateRange.from.toISOString().slice(0, 10));
      if (dateRange.to) params.set('to', dateRange.to.toISOString().slice(0, 10));
      const qs = params.toString();
      const res = await fetch(`/api/dashboard/analytics${qs ? `?${qs}` : ''}`);
      if (!res.ok) {
        setFetchError(true);
        return;
      }
      const result = await res.json();
      setData(result?.analytics ?? null);
      setTopQRCodes(result?.topQRCodes ?? []);
      setRetentionCutoff(result?.retentionCutoff ?? null);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.plan?.name) setPlanName(d.plan.name);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive/70" />
          <p className="font-medium">{t('analytics.loadError')}</p>
          <Button variant="outline" size="sm" onClick={() => { setLoading(true); fetchAnalytics(); }}>
            {t('analytics.retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.totalScans === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Radio className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">{t('analytics.noScans')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('analytics.noScansHint')}</p>
          <ul className="mt-4 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
            <li>• {t('analytics.emptyTip1')}</li>
            <li>• {t('analytics.emptyTip2')}</li>
            <li>• {t('analytics.emptyTip3')}</li>
          </ul>
          <Link href="/qr/create?quick=1" className="mt-6">
            <Button size="sm">{t('analytics.emptyCta')}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const topCountries = (data.scansByCountry ?? []).filter((c) => c.name !== 'Unknown').slice(0, 5);
  const topCities = (data.scansByCity ?? []).filter((c) => c.name !== 'Unknown').slice(0, 5);

  return (
    <div className="space-y-6">
      {retentionCutoff && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2 text-sm">
          <span>
            {t('analytics.retentionBanner', {
              date: format(new Date(retentionCutoff), 'MMM d, yyyy'),
              plan: planName,
            })}
          </span>
          <Link href="/pricing" className="text-primary hover:underline text-xs font-medium">
            {t('analytics.retentionUpgrade')}
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateRangePicker value={dateRange} onChange={(v) => setDateRange(v ?? {})} />
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => downloadAnalyticsCsv(data, 'dashboard-analytics')}
        >
          <Download className="h-4 w-4" /> {t('analytics.exportCsv')}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t('analytics.today'), value: data.todayScans, icon: Clock, color: 'text-orange-500' },
          { label: t('analytics.last7Days'), value: data.last7Days, icon: TrendingUp, color: 'text-green-500' },
          { label: t('analytics.uniqueVisitors'), value: data.uniqueScans, icon: Users, color: 'text-violet-500' },
          { label: t('analytics.countries'), value: topCountries.length, icon: Globe, color: 'text-blue-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">{t('analytics.scanActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.scansByDay} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tickLine={false} tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#dashScans)" name="Scans" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {t('analytics.topLocations')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('analytics.noLocation')}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('analytics.countries')}</p>
                {topCountries.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span>{c.name}</span>
                    <Badge variant="secondary" className="font-mono text-xs">{c.value}</Badge>
                  </div>
                ))}
              </div>
            )}
            {topCities.length > 0 && (
              <div className="space-y-2 border-t border-border/50 pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('analytics.cities')}</p>
                {topCities.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span>{c.name}</span>
                    <Badge variant="outline" className="font-mono text-xs">{c.value}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {topQRCodes.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> {t('analytics.topQrCodes')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topQRCodes.map((qr) => (
              <div key={qr.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/40">
                <Link href={`/qr/${qr.id}/analytics`} className="truncate font-medium hover:text-primary">
                  {qr.name}
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{t('analytics.allTime')}</span>
                  <Badge variant="secondary" className="font-mono">{qr.totalScans}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {t('analytics.liveScans')}
          </CardTitle>
          <span className="text-xs text-muted-foreground">{t('analytics.updatesEvery')}</span>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {(data.recentScans ?? []).slice(0, 8).map((scan, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">
                    {scan.country}{scan.city ? `, ${scan.city}` : ''}
                  </span>
                  <span className="hidden sm:flex items-center gap-1 text-muted-foreground/70">
                    <Smartphone className="h-3 w-3" />
                    {scan.device} · {scan.os}
                  </span>
                  {scan.qrName && (
                    <Badge variant="outline" className="hidden md:inline-flex text-xs truncate max-w-[120px]">
                      {scan.qrName}
                    </Badge>
                  )}
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {scan.scannedAt ? timeAgo(scan.scannedAt) : ''}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
