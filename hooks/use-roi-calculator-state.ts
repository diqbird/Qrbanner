'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { resolveBcp47Locale } from '@/lib/i18n/format-locale';

const PRO_ANNUAL = 9.99 * 12 * 0.8;

export function useRoiCalculatorState() {
  const { t, locale } = useLanguage();
  const [locations, setLocations] = useState(5);
  const [reprints, setReprints] = useState(4);
  const [costPerReprint, setCostPerReprint] = useState(120);

  const { staticCost, dynamicCost, savings } = useMemo(() => {
    const loc = Math.max(1, locations);
    const rep = Math.max(0, reprints);
    const cost = Math.max(0, costPerReprint);
    const staticTotal = loc * rep * cost;
    const dynamicTotal = PRO_ANNUAL;
    return {
      staticCost: staticTotal,
      dynamicCost: dynamicTotal,
      savings: Math.max(0, staticTotal - dynamicTotal),
    };
  }, [locations, reprints, costPerReprint]);

  const fmt = (n: number) => {
    const currency = locale === 'tr' ? 'TRY' : 'USD';
    const rate = locale === 'tr' ? 34 : 1;
    return (n * rate).toLocaleString(resolveBcp47Locale(locale), {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
  };

  return {
    t,
    locations,
    setLocations,
    reprints,
    setReprints,
    costPerReprint,
    setCostPerReprint,
    staticCost,
    dynamicCost,
    savings,
    fmt,
  };
}

export type RoiCalculatorState = ReturnType<typeof useRoiCalculatorState>;
