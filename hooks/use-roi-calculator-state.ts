'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/i18n/language-provider';
import { formatLocaleCurrency } from '@/lib/i18n/format-locale';
import { PLANS, annualTotalPrice } from '@/lib/plans';

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
    const dynamicTotal = annualTotalPrice(PLANS.pro.priceMonthly ?? 0);
    return {
      staticCost: staticTotal,
      dynamicCost: dynamicTotal,
      savings: Math.max(0, staticTotal - dynamicTotal),
    };
  }, [locations, reprints, costPerReprint]);

  const fmt = (n: number) =>
    formatLocaleCurrency(n, locale, { maximumFractionDigits: 0, convertTry: true });

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
