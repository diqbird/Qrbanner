'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RoiCalculatorState } from '@/hooks/use-roi-calculator-state';

export function RoiCalculatorInputs({ state }: { state: RoiCalculatorState }) {
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
