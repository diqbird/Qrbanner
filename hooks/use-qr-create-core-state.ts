'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_QR_STYLE } from '@/components/qr/qr-style-editor';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import type { IndustryTemplate } from '@/lib/industry-templates';
import { useQrFeatureFields } from '@/hooks/use-qr-feature-fields';

export function useQrCreateCoreState() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [qrData, setQrData] = useState<Record<string, string>>({});
  const styleHistory = useQRStyleHistory(DEFAULT_QR_STYLE);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [storedLogoPath, setStoredLogoPath] = useState<string | null>(null);
  const featureFields = useQrFeatureFields();
  const [activeTemplate, setActiveTemplate] = useState<IndustryTemplate | null>(null);
  const [templateGuideDismissed, setTemplateGuideDismissed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishAsActive, setPublishAsActive] = useState(true);
  const [mode, setMode] = useState<'quick' | 'wizard'>(() =>
    searchParams?.get('quick') === '1' ? 'quick' : 'wizard',
  );

  return {
    step,
    setStep,
    category,
    setCategory,
    name,
    setName,
    qrData,
    setQrData,
    ...styleHistory,
    logoFile,
    setLogoFile,
    logoPreview,
    setLogoPreview,
    storedLogoPath,
    setStoredLogoPath,
    featureFields,
    activeTemplate,
    setActiveTemplate,
    templateGuideDismissed,
    setTemplateGuideDismissed,
    saving,
    setSaving,
    publishAsActive,
    setPublishAsActive,
    mode,
    setMode,
  };
}
