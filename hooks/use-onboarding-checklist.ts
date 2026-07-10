'use client';

import { useEffect, useState } from 'react';
import {
  ONBOARDING_CHECKLIST_ITEMS,
  ONBOARDING_CHECKLIST_PROGRESS_KEY,
  ONBOARDING_CHECKLIST_STORAGE_KEY,
} from '@/lib/onboarding-checklist-items';

export type OnboardingChecklistHints = {
  qrCount: number;
  totalScans: number;
};

function autoCheckedKeys(hints: OnboardingChecklistHints): Record<string, boolean> {
  const next: Record<string, boolean> = {};
  if (hints.qrCount >= 1) next['checklist.download'] = true;
  if (hints.totalScans > 0) next['checklist.analytics'] = true;
  return next;
}

export function useOnboardingChecklist(hints: OnboardingChecklistHints) {
  const { qrCount, totalScans } = hints;
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (qrCount < 1 || qrCount > 5) return;
    try {
      if (localStorage.getItem(ONBOARDING_CHECKLIST_STORAGE_KEY)) return;
      const saved = localStorage.getItem(ONBOARDING_CHECKLIST_PROGRESS_KEY);
      const manual = saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
      const merged = { ...manual, ...autoCheckedKeys({ qrCount, totalScans }) };
      setChecked(merged);
      localStorage.setItem(ONBOARDING_CHECKLIST_PROGRESS_KEY, JSON.stringify(merged));
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [qrCount, totalScans]);

  const dismiss = () => {
    try {
      localStorage.setItem(ONBOARDING_CHECKLIST_STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(ONBOARDING_CHECKLIST_PROGRESS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const doneCount = ONBOARDING_CHECKLIST_ITEMS.filter((item) => checked[item.key]).length;

  return { visible, checked, dismiss, toggle, doneCount, items: ONBOARDING_CHECKLIST_ITEMS };
}
