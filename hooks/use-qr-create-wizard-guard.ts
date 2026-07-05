'use client';

import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';

export function useQrCreateWizardGuard({
  mode,
  saving,
  step,
  category,
  name,
  qrData,
  logoFile,
  logoPreview,
}: {
  mode: 'quick' | 'wizard';
  saving: boolean;
  step: number;
  category: string;
  name: string;
  qrData: Record<string, string>;
  logoFile: File | null;
  logoPreview: string | null;
}) {
  const hasWizardProgress =
    step > 0 ||
    Boolean(category) ||
    Boolean(name.trim()) ||
    Object.values(qrData).some((v) => String(v ?? '').trim() !== '') ||
    Boolean(logoFile) ||
    Boolean(logoPreview);

  useUnsavedChangesGuard(mode === 'wizard' && hasWizardProgress && !saving);
}
