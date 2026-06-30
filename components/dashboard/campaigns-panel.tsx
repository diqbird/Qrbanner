'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Plus, BarChart3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/i18n/language-provider';

interface Campaign {
  id: string;
  name: string;
  qrCount: number;
  totalScans: number;
  activeCount: number;
}

export function CampaignsPanel() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? t('campaigns.createFailed'));
        return;
      }
      toast.success(t('campaigns.created'));
      setNewName('');
      setShowForm(false);
      await load();
    } catch {
      toast.error(t('auth.somethingWrong'));
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <Megaphone className="h-5 w-5 text-primary" />
          {t('campaigns.title')}
        </CardTitle>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3.5 w-3.5" />
          {t('campaigns.new')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('campaigns.subtitle')}</p>

        {showForm && (
          <div className="flex gap-2">
            <Input
              placeholder={t('campaigns.namePlaceholder')}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button onClick={handleCreate} disabled={creating || !newName.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : t('campaigns.create')}
            </Button>
          </div>
        )}

        {campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('campaigns.empty')}</p>
        ) : (
          <ul className="space-y-2">
            {campaigns.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard?batchId=${c.id}`}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:border-primary/30 hover:bg-muted/30"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.qrCount} QR · {c.activeCount} {t('campaigns.active')}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="secondary" className="gap-1 tabular-nums">
                      <BarChart3 className="h-3 w-3" />
                      {c.totalScans.toLocaleString()}
                    </Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
