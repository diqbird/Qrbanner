'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';
import { Smartphone, Globe, Monitor, MapPin, Split, Nfc, Clock, Cpu } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { ANALYTICS_CHART_COLORS, type AnalyticsChartsData } from '@/lib/analytics-chart-constants';

const COLORS = ANALYTICS_CHART_COLORS;

export function AnalyticsChartsDistribution({ data }: { data: AnalyticsChartsData }) {
  const { t } = useLanguage();
  const scansByDevice = data?.scansByDevice ?? [];
  const scansByBrowser = data?.scansByBrowser ?? [];
  const scansByCountry = (data?.scansByCountry ?? []).filter((c) => c.name !== 'Unknown').slice(0, 10);
  const scansByCity = (data?.scansByCity ?? []).filter((c) => c.name !== 'Unknown').slice(0, 8);
  const scansBySource = (data?.scansBySource ?? []).filter((s) => s.name && s.name !== 'Unknown');
  const scansByOS = (data?.scansByOS ?? []).filter((s) => s.name && s.name !== 'Unknown');
  const scansByHour = data?.scansByHour ?? [];
  const scansByAbVariant = (data?.scansByAbVariant ?? []).filter((s) => s.name && s.name !== 'Unknown');

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" /> {t('analytics.charts.devices')}
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
            <Monitor className="h-4 w-4 text-primary" /> {t('analytics.charts.browsers')}
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
              <Cpu className="h-4 w-4 text-primary" /> {t('analytics.charts.operatingSystems')}
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
              <Clock className="h-4 w-4 text-primary" /> {t('analytics.charts.scansByHour')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scansByHour}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={2} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="value" fill="#A19AD3" radius={[4, 4, 0, 0]} name={t('analytics.charts.scans')} />
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
            <Globe className="h-4 w-4 text-primary" /> {t('analytics.charts.topCountries')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scansByCountry.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t('analytics.charts.noCountryData')}
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
                <Bar dataKey="value" fill="#60B5FF" radius={[4, 4, 0, 0]} name={t('analytics.charts.scans')} />
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
              <MapPin className="h-4 w-4 text-primary" /> {t('analytics.charts.topCities')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scansByCity} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={50} />
                  <YAxis tickLine={false} tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="value" fill="#80D8C3" radius={[4, 4, 0, 0]} name={t('analytics.charts.scans')} />
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
              <Nfc className="h-4 w-4 text-primary" /> {t('analytics.charts.scanSource')}
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
              <Split className="h-4 w-4 text-primary" /> {t('analytics.charts.abVariants')}
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
    </>
  );
}
