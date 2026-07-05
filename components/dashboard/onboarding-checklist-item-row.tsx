'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import type { ONBOARDING_CHECKLIST_ITEMS } from '@/lib/onboarding-checklist-items';

type ChecklistItem = (typeof ONBOARDING_CHECKLIST_ITEMS)[number];

export function OnboardingChecklistItemRow({
  item,
  isDone,
  onToggle,
}: {
  item: ChecklistItem;
  isDone: boolean;
  onToggle: () => void;
}) {
  const { t } = useLanguage();
  const Icon = item.icon;

  return (
    <li>
      <div className="flex items-center gap-3 rounded-lg border border-border/40 px-3 py-2.5">
        <button type="button" onClick={onToggle} className="shrink-0 text-primary" aria-pressed={isDone}>
          {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
        </button>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className={`flex-1 text-sm ${isDone ? 'text-muted-foreground line-through' : ''}`}>
          {t(item.key)}
        </span>
        <Link href={item.href}>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            {t('onboarding.checklistGo')}
          </Button>
        </Link>
      </div>
    </li>
  );
}
