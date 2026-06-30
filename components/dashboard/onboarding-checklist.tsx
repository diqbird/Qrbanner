'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, CheckCircle2, Circle, Download, BarChart3, Globe, Code2, Users } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

const STORAGE_KEY = 'qrb_onboarding_checklist_dismissed';

const ITEMS = [
  { key: 'checklist.download', href: '/qr/create?quick=1', icon: Download },
  { key: 'checklist.analytics', href: '/dashboard', icon: BarChart3 },
  { key: 'checklist.domain', href: '/settings', icon: Globe },
  { key: 'checklist.api', href: '/developers', icon: Code2 },
  { key: 'checklist.team', href: '/settings', icon: Users },
] as const;

export function OnboardingChecklist({ qrCount }: { qrCount: number }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (qrCount < 1 || qrCount > 5) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const saved = localStorage.getItem('qrb_onboarding_checklist_progress');
      if (saved) setChecked(JSON.parse(saved) as Record<string, boolean>);
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [qrCount]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('qrb_onboarding_checklist_progress', JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (!visible) return null;

  const doneCount = ITEMS.filter((item) => checked[item.key]).length;

  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display font-semibold">{t('onboarding.checklistTitle')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('onboarding.checklistSubtitle')}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('onboarding.checklistProgress', { done: doneCount, total: ITEMS.length })}
            </p>
          </div>
          <button type="button" onClick={dismiss} className="text-muted-foreground hover:text-foreground" aria-label={t('common.dismissAria')}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const isDone = Boolean(checked[item.key]);
            return (
              <li key={item.key}>
                <div className="flex items-center gap-3 rounded-lg border border-border/40 px-3 py-2.5">
                  <button type="button" onClick={() => toggle(item.key)} className="shrink-0 text-primary" aria-pressed={isDone}>
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
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
