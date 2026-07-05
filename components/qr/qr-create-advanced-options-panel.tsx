'use client';

import { ChevronDown } from 'lucide-react';
import { AdvancedSettings } from './advanced-settings';
import { ScanNotifySettings } from './scan-notify-settings';
import { AnalyticsPixelSettings } from './analytics-pixel-settings';
import { QrCreateAdvancedDynamicPanel } from './qr-create-advanced-dynamic-panel';
import { useLanguage } from '@/components/i18n/language-provider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { isDynamicCategory } from '@/lib/qr-utils';
import type { QrCreateStepDesignProps } from '@/lib/qr-create-step-design-types';

export function QrCreateAdvancedOptionsPanel(props: QrCreateStepDesignProps) {
  const { t } = useLanguage();
  const { category, advanced, scanNotify, pixels, onAdvancedChange, onScanNotifyChange, onPixelsChange } =
    props;

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-left text-sm font-medium hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
        <span>
          {t('create.advancedOptions')}
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            {t('create.advancedOptionsDesc')}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-6">
        <AdvancedSettings category={category} values={advanced} onChange={onAdvancedChange} />
        {isDynamicCategory(category) && <QrCreateAdvancedDynamicPanel {...props} />}
        <ScanNotifySettings values={scanNotify} onChange={onScanNotifyChange} />
        <AnalyticsPixelSettings values={pixels} onChange={onPixelsChange} />
      </CollapsibleContent>
    </Collapsible>
  );
}
