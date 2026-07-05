export type MockupPresetId = 'card' | 'poster' | 'shirt' | 'mug';
export type MockupKey = MockupPresetId | 'custom';

export type MockupPlacement = {
  size: number;
  top: number;
  left: number;
};

export type MockupPresetConfig = {
  id: MockupPresetId;
  label: string;
  image: string;
  defaultSize: number;
  defaultTop: number;
  defaultLeft: number;
  invertQr?: boolean;
  aspect: string;
};

export const MOCKUP_PRESETS: MockupPresetConfig[] = [
  {
    id: 'card',
    label: 'Business Card',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop',
    defaultSize: 16,
    defaultTop: 58,
    defaultLeft: 78,
    aspect: '4/3',
  },
  {
    id: 'poster',
    label: 'Poster / Flyer',
    image: 'https://images.unsplash.com/photo-1561214115-f2f8c08e92b2?w=800&q=80&auto=format&fit=crop',
    defaultSize: 28,
    defaultTop: 52,
    defaultLeft: 50,
    aspect: '3/4',
  },
  {
    id: 'shirt',
    label: 'T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop',
    defaultSize: 14,
    defaultTop: 42,
    defaultLeft: 38,
    invertQr: true,
    aspect: '4/5',
  },
  {
    id: 'mug',
    label: 'Mug',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80&auto=format&fit=crop',
    defaultSize: 12,
    defaultTop: 48,
    defaultLeft: 62,
    aspect: '4/3',
  },
];

export const MOCKUP_CUSTOM_DEFAULTS: MockupPlacement = { size: 20, top: 50, left: 50 };

export function mockupDefaultsFor(key: MockupKey): MockupPlacement {
  if (key === 'custom') return { ...MOCKUP_CUSTOM_DEFAULTS };
  const mock = MOCKUP_PRESETS.find((m) => m.id === key) ?? MOCKUP_PRESETS[1];
  return { size: mock.defaultSize, top: mock.defaultTop, left: mock.defaultLeft };
}

export function clampMockupPct(n: number, min = 5, max = 95) {
  return Math.min(max, Math.max(min, n));
}

export function clampMockupSize(n: number) {
  return Math.min(60, Math.max(4, Math.round(n)));
}

export function getMockupPreset(key: MockupKey) {
  if (key === 'custom') return MOCKUP_PRESETS[1];
  return MOCKUP_PRESETS.find((m) => m.id === key) ?? MOCKUP_PRESETS[1];
}
