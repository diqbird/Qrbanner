'use client';

import { useState } from 'react';
import { DEFAULT_QR_STYLE } from '@/components/qr/qr-style-editor';
import { useQRStyleHistory } from '@/hooks/use-qr-style-history';
import { useQrFeatureFields } from '@/hooks/use-qr-feature-fields';

export function useQrEditCoreState() {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [qrData, setQrData] = useState<Record<string, string>>({});
  const styleHistory = useQRStyleHistory(DEFAULT_QR_STYLE);
  const [isActive, setIsActive] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [storedLogoPath, setStoredLogoPath] = useState<string | null>(null);
  const featureFields = useQrFeatureFields();
  const [hasExistingPassword, setHasExistingPassword] = useState(false);
  const [removePassword, setRemovePassword] = useState(false);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);

  return {
    saving,
    setSaving,
    name,
    setName,
    targetUrl,
    setTargetUrl,
    qrData,
    setQrData,
    ...styleHistory,
    isActive,
    setIsActive,
    logoPreview,
    setLogoPreview,
    logoFile,
    setLogoFile,
    storedLogoPath,
    setStoredLogoPath,
    featureFields,
    hasExistingPassword,
    setHasExistingPassword,
    removePassword,
    setRemovePassword,
    folderId,
    setFolderId,
    labels,
    setLabels,
  };
}
