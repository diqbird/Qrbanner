'use client';

import { useCallback } from 'react';
import { downscaleLogo } from '@/lib/image-downscale';

export function useQrCreateLogo({
  logoFile,
  setLogoFile,
  setLogoPreview,
  setStoredLogoPath,
}: {
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  setLogoPreview: (preview: string | null) => void;
  setStoredLogoPath: (path: string | null) => void;
}) {
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setStoredLogoPath(null);
    try {
      const { dataUrl, file: optimized } = await downscaleLogo(file);
      setLogoFile(optimized);
      setLogoPreview(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  const applyTemplateLogo = useCallback(
    (path: string | null) => {
      setStoredLogoPath(path);
      if (path) setLogoPreview(path);
    },
    [setStoredLogoPath, setLogoPreview],
  );

  const uploadLogo = async (file?: File | null): Promise<{ cloud_storage_path: string } | null> => {
    const toUpload = file ?? logoFile;
    if (!toUpload) return null;
    try {
      const formData = new FormData();
      formData.append('file', toUpload);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) return null;
      const { path } = await res.json();
      return { cloud_storage_path: path };
    } catch (e: unknown) {
      console.error('Logo upload failed:', e);
      return null;
    }
  };

  return { handleLogoChange, applyTemplateLogo, uploadLogo };
}
