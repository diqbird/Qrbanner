'use client';

import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { QR_CREATE_STEP_KEYS } from '@/lib/qr-category-icons';

export function QrCreateStepIndicator({ step }: { step: number }) {
  const { t } = useLanguage();
  const steps = QR_CREATE_STEP_KEYS.map((key) => t(key));

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`hidden text-sm sm:block ${i <= step ? 'font-medium' : 'text-muted-foreground'}`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={`h-px w-8 ${i < step ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
