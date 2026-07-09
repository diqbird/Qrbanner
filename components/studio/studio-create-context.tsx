'use client';

import { createContext, useContext } from 'react';

export type StudioCreateConfig = {
  entitlementId: string;
  token: string;
  qrRemaining: number;
  maxQr: number;
  onQrCreated: (qrId: string, qrRemaining: number) => void;
};

const StudioCreateContext = createContext<StudioCreateConfig | null>(null);

export function StudioCreateProvider({
  value,
  children,
}: {
  value: StudioCreateConfig;
  children: React.ReactNode;
}) {
  return <StudioCreateContext.Provider value={value}>{children}</StudioCreateContext.Provider>;
}

export function useStudioCreateConfig(): StudioCreateConfig | null {
  return useContext(StudioCreateContext);
}
