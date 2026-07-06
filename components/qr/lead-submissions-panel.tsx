'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, Phone, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveAnalyticsCountryLabel } from '@/lib/i18n/resolve-analytics-country-label';

interface LeadRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  createdAt: string;
}

export function LeadSubmissionsPanel({ qrId }: { qrId: string }) {
  const { t, locale } = useLanguage();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch(`/api/qr/${qrId}/leads`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [qrId]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (loading) return null;
  if (total === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-primary" /> {t('analytics.leads.title')}
        </CardTitle>
        <Badge variant="secondary">{t('analytics.leads.total', { count: String(total) })}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-muted/30 px-4 py-3 text-sm"
          >
            <div className="space-y-1">
              {lead.name && <p className="font-medium">{lead.name}</p>}
              <div className="flex flex-wrap gap-3 text-muted-foreground">
                {lead.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {lead.email}
                  </span>
                )}
                {lead.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {lead.phone}
                  </span>
                )}
              </div>
              {lead.message && (
                <p className="flex items-start gap-1 text-muted-foreground">
                  <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" /> {lead.message}
                </p>
              )}
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>
                {lead.country
                  ? resolveAnalyticsCountryLabel(t, lead.country, locale)
                  : ''}
                {lead.city ? `${lead.country ? ', ' : ''}${lead.city}` : ''}
              </p>
              <p>{new Date(lead.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
