'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/i18n/language-provider';

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
    const dateLocale = locale === 'tr' ? 'tr-TR' : 'en-US';
    const currency = locale === 'tr' ? 'TRY' : 'USD';
    const rate = locale === 'tr' ? 34 : 1;
    return (n * rate).toLocaleString(dateLocale, { style: 'currency', currency, maximumFractionDigits: 0 });
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

export function RoiCalculatorInputs({
  state,
}: {
  state: ReturnType<typeof useRoiCalculatorState>;
}) {
  const { t, locations, setLocations, reprints, setReprints, costPerReprint, setCostPerReprint } = state;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">{t('roi.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="roi-locations">{t('roi.locations')}</Label>
          <Input
            id="roi-locations"
            type="number"
            min={1}
            value={locations}
            onChange={(e) => setLocations(Number(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roi-reprints">{t('roi.reprints')}</Label>
          <Input
            id="roi-reprints"
            type="number"
            min={0}
            value={reprints}
            onChange={(e) => setReprints(Number(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="roi-cost">{t('roi.costPerReprint')}</Label>
          <Input
            id="roi-cost"
            type="number"
            min={0}
            value={costPerReprint}
            onChange={(e) => setCostPerReprint(Number(e.target.value) || 0)}
          />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{t('roi.note')}</p>
      </CardContent>
    </Card>
  );
}
