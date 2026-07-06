'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Loader2 } from 'lucide-react';
import type { CampaignsPanelState } from '@/hooks/use-campaigns-panel';

export function CampaignsPanelList({ panel }: { panel: CampaignsPanelState }) {
  const { t, campaigns, creating, newName, setNewName, showForm, setShowForm, handleCreate } = panel;

  return (
    <>
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
                    {t('campaigns.qrSummary', { qrCount: c.qrCount, activeCount: c.activeCount })}
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
    </>
  );
}
