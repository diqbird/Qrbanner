'use client';

import { useMemo, useRef, useState } from 'react';
import type { MockupKey, MockupPresetId } from '@/lib/mockup-presets';
import { getMockupPreset } from '@/lib/mockup-presets';
import { useMockupPlacement } from '@/hooks/use-mockup-placement';

export function useMockupPreviewState() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MockupKey>('poster');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placement = useMockupPlacement(active);

  const preset = getMockupPreset(active);
  const isCustom = active === 'custom';
  const backgroundImage = isCustom ? customImage : preset.image;
  const invertQr = !isCustom && preset.invertQr;
  const aspectStyle = useMemo(
    () => ({ aspectRatio: isCustom ? '4/3' : preset.aspect }),
    [isCustom, preset.aspect],
  );

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomImage(reader.result as string);
      setActive('custom');
      placement.initCustomPlacement();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const selectPreset = (id: MockupPresetId) => setActive(id);

  const selectCustom = () => {
    setActive('custom');
    if (!customImage) fileInputRef.current?.click();
  };

  return {
    open,
    setOpen,
    active,
    customImage,
    fileInputRef,
    preset,
    isCustom,
    backgroundImage,
    invertQr,
    aspectStyle,
    handleCustomUpload,
    selectPreset,
    selectCustom,
    ...placement,
  };
}

export type MockupPreviewState = ReturnType<typeof useMockupPreviewState>;
