'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ADMIN_DASHBOARD_WIDGETS } from '@/lib/admin/modules';
import type { AdminWidgetId } from '@/lib/admin/types';

type WidgetState = { id: AdminWidgetId; order: number; visible: boolean };

type AdminUiState = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  widgets: WidgetState[];
  setSidebarCollapsed: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
  toggleWidget: (id: AdminWidgetId) => void;
  reorderWidgets: (ids: AdminWidgetId[]) => void;
  resetWidgets: () => void;
};

function defaultWidgets(): WidgetState[] {
  return ADMIN_DASHBOARD_WIDGETS.map((w) => ({
    id: w.id,
    order: w.defaultOrder,
    visible: w.defaultVisible,
  }));
}

export const useAdminUiStore = create<AdminUiState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      widgets: defaultWidgets(),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      toggleWidget: (id) =>
        set({
          widgets: get().widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)),
        }),
      reorderWidgets: (ids) =>
        set({
          widgets: ids.map((id, order) => {
            const existing = get().widgets.find((w) => w.id === id);
            return { id, order, visible: existing?.visible ?? true };
          }),
        }),
      resetWidgets: () => set({ widgets: defaultWidgets() }),
    }),
    { name: 'qrb-admin-ui' },
  ),
);
