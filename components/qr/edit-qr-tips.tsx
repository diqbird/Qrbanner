'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';

const STORAGE_KEY = 'qrb_edit_qr_tips_hidden';
const TIP_KEYS = ['editTips.tip1', 'editTips.tip2', 'editTips.tip3', 'editTips.tip4'] as const;

export function EditQrTips() {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) setHidden(true);
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setHidden(true);
  };

  if (hidden) return null;

  return (
    <div className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-3" role="note">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <ul className="flex-1 space-y-1.5 text-sm text-muted-foreground">
          {TIP_KEYS.map((key) => (
            <li key={key} className="flex gap-2">
              <span className="text-primary" aria-hidden>
                •
              </span>
              {t(key)}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={t('editTips.dismiss')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
