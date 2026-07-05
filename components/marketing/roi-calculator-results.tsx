'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { RoiCalculatorState } from '@/hooks/use-roi-calculator-state';

export function RoiCalculatorResults({
  state,
}: {
  state: RoiCalculatorState;
}) {
  const { t, staticCost, dynamicCost, savings, fmt } = state;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="space-y-6 pt-8">
        <div>
          <p className="text-sm text-muted-foreground">{t('roi.staticLabel')}</p>
          <p className="font-display text-3xl font-bold">{fmt(staticCost)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t('roi.dynamicLabel')}</p>
          <p className="font-display text-3xl font-bold text-primary">{fmt(dynamicCost)}</p>
        </div>
        <div className="rounded-xl border border-primary/30 bg-background p-4">
          <p className="text-sm font-medium text-muted-foreground">{t('roi.savings')}</p>
          <p className="font-display text-4xl font-bold text-primary">{fmt(savings)}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/qr/create?quick=1">
            <Button className="w-full gap-2 sm:w-auto">
              {t('roi.cta')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" className="w-full sm:w-auto">
              {t('roi.ctaPricing')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
