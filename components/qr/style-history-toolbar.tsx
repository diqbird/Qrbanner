'use client';

import { Undo2, Redo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/i18n/language-provider';

type StyleHistoryToolbarProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

export function StyleHistoryToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: StyleHistoryToolbarProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label={t('style.undo')}
      >
        <Undo2 className="h-3.5 w-3.5" />
        {t('style.undo')}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label={t('style.redo')}
      >
        <Redo2 className="h-3.5 w-3.5" />
        {t('style.redo')}
      </Button>
    </div>
  );
}
