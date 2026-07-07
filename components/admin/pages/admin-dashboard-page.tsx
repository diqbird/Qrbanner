'use client';

import { useQuery } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { AdminStatsCards } from '@/components/admin/admin-stats-cards';
import { AdminBillingPanel } from '@/components/admin/admin-billing-panel';
import { AdminAuditPanel } from '@/components/admin/admin-audit-panel';
import { useAdminContent } from '@/hooks/use-admin-content';
import { adminQueryKeys } from '@/lib/admin/query-keys';
import { useAdminUiStore } from '@/stores/admin-ui-store';
import { useLanguage } from '@/components/i18n/language-provider';
import { AdminPageHeader, AdminLoadingState } from '@/components/admin/shared/admin-states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AdminWidgetId } from '@/lib/admin/types';

function SortableWidget({
  id,
  children,
}: {
  id: AdminWidgetId;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <button
        type="button"
        className="absolute right-2 top-2 z-10 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
        {...attributes}
        {...listeners}
        aria-label="Drag widget"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

function SystemHealthCard() {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: adminQueryKeys.health(),
    queryFn: async () => {
      const res = await fetch('/api/admin/health');
      if (!res.ok) throw new Error('health_failed');
      return res.json() as Promise<{
        status: string;
        database: string;
        responseMs: number;
        redis: string;
        smtp: string;
      }>;
    },
  });

  if (isLoading) return <AdminLoadingState />;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('superAdmin.widgets.systemHealth')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span>{t('superAdmin.health.status')}</span>
          <Badge variant={data?.status === 'healthy' ? 'default' : 'destructive'}>{data?.status}</Badge>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span>{t('superAdmin.health.database')}</span>
          <span className="text-muted-foreground">{data?.database}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span>{t('superAdmin.health.response')}</span>
          <span className="text-muted-foreground">{data?.responseMs}ms</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span>Redis / SMTP</span>
          <span className="text-xs text-muted-foreground">{data?.redis} · {data?.smtp}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPage() {
  const { t } = useLanguage();
  const admin = useAdminContent();
  const widgets = useAdminUiStore((s) => s.widgets);
  const reorderWidgets = useAdminUiStore((s) => s.reorderWidgets);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const visible = [...widgets].filter((w) => w.visible).sort((a, b) => a.order - b.order);
  const ids = visible.map((w) => w.id);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id as AdminWidgetId);
    const newIndex = ids.indexOf(over.id as AdminWidgetId);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = [...ids];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);
    reorderWidgets(next);
  };

  const renderWidget = (id: AdminWidgetId) => {
    switch (id) {
      case 'stats':
        return <AdminStatsCards admin={admin} />;
      case 'billing':
        return admin.stats ? (
          <AdminBillingPanel
            planCounts={admin.stats.planCounts}
            estimatedMrr={admin.stats.estimatedMrr}
            paddleSubscribers={admin.stats.paddleSubscribers}
          />
        ) : null;
      case 'recent-audit':
        return <AdminAuditPanel />;
      case 'system-health':
        return <SystemHealthCard />;
      default:
        return null;
    }
  };

  if (admin.loading && !admin.stats) {
    return <AdminLoadingState label={t('admin.loadFailed')} />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t('superAdmin.nav.dashboard')} description={t('admin.subtitle')} />
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
        {t('admin.launchBanner')}
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {visible.map((w) => (
              <SortableWidget key={w.id} id={w.id}>
                {renderWidget(w.id)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
