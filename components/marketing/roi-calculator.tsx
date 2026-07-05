'use client';

import { useRoiCalculatorState, RoiCalculatorInputs } from './roi-calculator-inputs';
import { RoiCalculatorResults } from './roi-calculator-results';

export function RoiCalculator() {
  const state = useRoiCalculatorState();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <RoiCalculatorInputs state={state} />
      <RoiCalculatorResults state={state} />
    </div>
  );
}
