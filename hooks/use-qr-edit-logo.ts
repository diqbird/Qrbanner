'use client';

import { useCallback } from 'react';
import { downscaleLogo } from '@/lib/image-downscale';

export function useQrEditLogo({
  setLogoFile,
  setLogoPreview,
  setStoredLogoPath,
}: {
  setLogoFile: (file: File | null) => void;
  setLogoPreview: (preview: string | null) => void;
  setStoredLogoPath: (path: string | null) => void;
}) {
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
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

  return { handleLogoChange, applyTemplateLogo };
}
