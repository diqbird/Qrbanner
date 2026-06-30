'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { TrendingUp, Smartphone, Globe, Monitor, MapPin, Split, Nfc, Clock, Cpu } from 'lucide-react';
import { GpsHeatmapChart } from './gps-heatmap';
import type { HeatmapPoint } from '@/lib/gps-heatmap';

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

interface AnalyticsChartsProps {
  data: {
    scansByDay: { date: string; count: number }[];
    scansByDevice: { name: string; value: number }[];
    scansByBrowser: { name: string; value: number }[];
    scansByOS: { name: string; value: number }[];
    scansByHour?: { name: string; value: number }[];
    peakInsights?: { peakDay: { name: string; count: number } | null; peakHour: { name: string; count: number } | null };
    scansByCountry: { name: string; value: number }[];
    scansByCity?: { name: string; value: number }[];
    scansBySource?: { name: string; value: number }[];
    scansByAbVariant?: { name: string; value: number }[];
    heatmapPoints?: HeatmapPoint[];
  };
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const scansByDay = data?.scansByDay ?? [];
  const scansByDevice = data?.scansByDevice ?? [];
  const scansByBrowser = data?.scansByBrowser ?? [];
  const scansByCountry = (data?.scansByCountry ?? []).filter((c) => c.name !== 'Unknown').slice(0, 10);
  const scansByCity = (data?.scansByCity ?? []).filter((c) => c.name !== 'Unknown').slice(0, 8);
  const scansBySource = (data?.scansBySource ?? []).filter((s) => s.name && s.name !== 'Unknown');
  const heatmapPoints = data?.heatmapPoints ?? [];
  const scansByOS = (data?.scansByOS ?? []).filter((s) => s.name && s.name !== 'Unknown');
  const scansByHour = data?.scansByHour ?? [];
  const peakInsights = data?.peakInsights;
  const scansByAbVariant = (data?.scansByAbVariant ?? []).filter((s) => s.name && s.name !== 'Unknown');

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GpsHeatmapChart points={heatmapPoints} />

      {(peakInsights?.peakDay || peakInsights?.peakHour) && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Peak Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            {peakInsights?.peakDay && (
              <div>
                <p className="text-xs text-muted-foreground">Most active day</p>
                <p className="text-lg font-semibold">{peakInsights.peakDay.name} <span className="text-sm text-muted-foreground">({peakInsights.peakDay.count} scans)</span></p>
              </div>
            )}
            {peakInsights?.peakHour && (
              <div>
                <p className="text-xs text-muted-foreground">Most active hour</p>
                <p className="text-lg font-semibold">{peakInsights.peakHour.name} <span className="text-sm text-muted-foreground">({peakInsights.peakHour.count} scans)</span></p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scans Over Time */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Scans Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scansByDay} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60B5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60B5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#60B5FF"
                  strokeWidth={2}
                  fill="url(#colorScans)"
                  name="Scans"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Device Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" /> Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scansByDevice}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {scansByDevice.map((entry: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {scansByDevice.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{d?.name ?? 'Unknown'}: {d?.value ?? 0}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Browser Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" /> Browsers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scansByBrowser}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {scansByBrowser.map((entry: any, i: number) => (
                    <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {scansByBrowser.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[(i + 2) % COLORS.length] }} />
                <span>{d?.name ?? 'Unknown'}: {d?.value ?? 0}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {scansByOS.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" /> Operating Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={scansByOS} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {scansByOS.map((_, i) => (
                      <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {scansByHour.some((h) => h.value > 0) && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Scans by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scansByHour}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={2} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="value" fill="#A19AD3" radius={[4, 4, 0, 0]} name="Scans" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Countries */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Top Countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scansByCountry.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No country data for this period. New scans will show location after geo lookup.
            </p>
          ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scansByCountry} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Bar dataKey="value" fill="#60B5FF" radius={[4, 4, 0, 0]} name="Scans" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Top Cities */}
      {scansByCity.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Top Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scansByCity} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={50} />
                  <YAxis tickLine={false} tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="value" fill="#80D8C3" radius={[4, 4, 0, 0]} name="Scans" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {scansBySource.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Nfc className="h-4 w-4 text-primary" /> Scan Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scansBySource.map((s) => (
                <div key={s.name} className="flex justify-between text-sm">
                  <span className="capitalize">{s.name}</span>
                  <span className="font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {scansByAbVariant.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Split className="h-4 w-4 text-primary" /> A/B Variants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scansByAbVariant}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="value" fill="#A19AD3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
