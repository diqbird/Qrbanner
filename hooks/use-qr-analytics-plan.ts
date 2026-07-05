'use client';

import { useEffect, useState } from 'react';

export function useQrAnalyticsPlan() {
  const [planName, setPlanName] = useState('Free');

  useEffect(() => {
    fetch('/api/account/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.plan?.name) setPlanName(d.plan.name);
      })
      .catch(() => undefined);
  }, []);

  return planName;
}
