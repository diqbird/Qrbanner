'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Shirt, CreditCard, Image, Coffee, RotateCcw, Upload, Move, Minus, Plus, Maximize2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

type PresetId = 'card' | 'poster' | 'shirt' | 'mug';
type MockupKey = PresetId | 'custom';

type MockupConfig = {
  id: PresetId;
  label: string;
  icon: typeof CreditCard;
  image: string;
  defaultSize: number;
  defaultTop: number;
  defaultLeft: number;
  invertQr?: boolean;
  aspect: string;
};

const PRESETS: MockupConfig[] = [
  {
    id: 'card',
    label: 'Business Card',
    icon: CreditCard,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop',
    defaultSize: 16,
    defaultTop: 58,
    defaultLeft: 78,
    aspect: '4/3',
  },
  {
    id: 'poster',
    label: 'Poster / Flyer',
    icon: Image,
    image: 'https://images.unsplash.com/photo-1561214115-f2f8c08e92b2?w=800&q=80&auto=format&fit=crop',
    defaultSize: 28,
    defaultTop: 52,
    defaultLeft: 50,
    aspect: '3/4',
  },
  {
    id: 'shirt',
    label: 'T-Shirt',
    icon: Shirt,
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
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80&auto=format&fit=crop',
    defaultSize: 12,
    defaultTop: 48,
    defaultLeft: 62,
    aspect: '4/3',
  },
];

const CUSTOM_DEFAULTS = { size: 20, top: 50, left: 50 };

type Placement = { size: number; top: number; left: number };

function defaultsFor(key: MockupKey): Placement {
  if (key === 'custom') return { ...CUSTOM_DEFAULTS };
  const mock = PRESETS.find((m) => m.id === key) ?? PRESETS[1];
  return { size: mock.defaultSize, top: mock.defaultTop, left: mock.defaultLeft };
}

function clampPct(n: number, min = 5, max = 95) {
  return Math.min(max, Math.max(min, n));
}

function clampSize(n: number) {
  return Math.min(60, Math.max(4, Math.round(n)));
}

export function MockupPreview({ qrDataUrl }: { qrDataUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MockupKey>('poster');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Partial<Record<MockupKey, Placement>>>({});
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const resizeStartRef = useRef({ size: 0, clientY: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preset = PRESETS.find((m) => m.id === active) ?? PRESETS[1];
  const placement = placements[active] ?? defaultsFor(active);
  const isCustom = active === 'custom';
  const backgroundImage = isCustom ? customImage : preset.image;
  const invertQr = !isCustom && preset.invertQr;
  const aspectStyle = useMemo(
    () => ({ aspectRatio: isCustom ? '4/3' : preset.aspect }),
    [isCustom, preset.aspect]
  );

  useEffect(() => {
    setPlacements((prev) => {
      if (prev[active]) return prev;
      return { ...prev, [active]: defaultsFor(active) };
    });
  }, [active]);

  const updatePlacement = (patch: Partial<Placement>) => {
    setPlacements((prev) => ({
      ...prev,
      [active]: { ...(prev[active] ?? defaultsFor(active)), ...patch },
    }));
  };

  const resetPlacement = () => {
    setPlacements((prev) => ({ ...prev, [active]: defaultsFor(active) }));
  };

  const positionFromPointer = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      left: clampPct(((clientX - rect.left) / rect.width) * 100),
      top: clampPct(((clientY - rect.top) / rect.height) * 100),
    };
  };

  const onQrPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!qrDataUrl || resizing) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onQrPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (resizing) {
      const delta = (resizeStartRef.current.clientY - e.clientY) * 0.12;
      updatePlacement({ size: clampSize(resizeStartRef.current.size + delta) });
      return;
    }
    if (!dragging) return;
    const pos = positionFromPointer(e.clientX, e.clientY);
    if (pos) updatePlacement(pos);
  };

  const onQrPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging || resizing) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDragging(false);
      setResizing(false);
    }
  };

  const onResizeHandleDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const wrapper = e.currentTarget.parentElement;
    if (!wrapper) return;
    resizeStartRef.current = { size: placement.size, clientY: e.clientY };
    setResizing(true);
    wrapper.setPointerCapture(e.pointerId);
  };

  const onQrWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -2 : 2;
    updatePlacement({ size: clampSize(placement.size + delta) });
  };

  const nudgeSize = (delta: number) => {
    updatePlacement({ size: clampSize(placement.size + delta) });
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setCustomImage(dataUrl);
      setActive('custom');
      setPlacements((prev) => ({
        ...prev,
        custom: prev.custom ?? { ...CUSTOM_DEFAULTS },
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="font-display text-base">Surface Mockup Preview</CardTitle>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs">
                {open ? 'Hide' : 'Show'}
              </Button>
            </CollapsibleTrigger>
          </div>
          <p className="text-xs text-muted-foreground">
            Preset surfaces or your own photo — drag the QR to position, use sliders for size.
          </p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActive(m.id)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                    active === m.id
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <m.icon className="h-3.5 w-3.5" /> {m.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setActive('custom');
                  if (!customImage) fileInputRef.current?.click();
                }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  active === 'custom'
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Upload className="h-3.5 w-3.5" /> Your photo
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleCustomUpload}
            />

            {isCustom && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" />
                  {customImage ? 'Change photo' : 'Upload photo'}
                </Button>
              </div>
            )}

            <div
              ref={containerRef}
              className="relative mx-auto w-full max-w-sm touch-none overflow-hidden rounded-xl border bg-muted shadow-inner select-none"
              style={aspectStyle}
            >
              {backgroundImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={backgroundImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/10" aria-hidden />
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/80 p-4 text-center text-sm text-muted-foreground hover:bg-muted"
                >
                  <Upload className="h-8 w-8 opacity-50" />
                  <span>Upload your photo (JPG, PNG, WebP)</span>
                </button>
              )}

              {qrDataUrl && backgroundImage ? (
                <div
                  className={`absolute touch-none ${
                    dragging ? 'cursor-grabbing' : resizing ? 'cursor-se-resize' : 'cursor-grab'
                  }`}
                  style={{
                    width: `${placement.size}%`,
                    top: `${placement.top}%`,
                    left: `${placement.left}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onPointerDown={onQrPointerDown}
                  onPointerMove={onQrPointerMove}
                  onPointerUp={onQrPointerUp}
                  onPointerCancel={onQrPointerUp}
                  onWheel={onQrWheel}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="QR on mockup"
                    className={`w-full rounded-sm bg-white p-0.5 shadow-lg ring-1 ring-black/10 ${
                      dragging || resizing ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ filter: invertQr ? 'invert(1)' : undefined }}
                    draggable={false}
                  />
                  <button
                    type="button"
                    aria-label="Resize QR"
                    className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md hover:scale-110 active:scale-95"
                    onPointerDown={onResizeHandleDown}
                  >
                    <Maximize2 className="h-2.5 w-2.5" />
                  </button>
                </div>
              ) : !backgroundImage ? null : (
                <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-white drop-shadow">
                  Generate preview first
                </p>
              )}
            </div>

            {qrDataUrl && backgroundImage && (
              <div className="flex flex-col items-center gap-2">
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <Move className="h-3.5 w-3.5" /> Drag to move · corner handle or scroll to resize
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground">QR size</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => nudgeSize(-2)}
                    aria-label="Decrease QR size"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="min-w-[3rem] text-center font-mono text-sm font-medium">
                    {placement.size}%
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => nudgeSize(2)}
                    aria-label="Increase QR size"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  <div className="ml-1 flex gap-1 border-l border-border/60 pl-2">
                    {[
                      { label: 'S', size: 12 },
                      { label: 'M', size: 22 },
                      { label: 'L', size: 35 },
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant={Math.abs(placement.size - preset.size) < 2 ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => updatePlacement({ size: preset.size })}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {qrDataUrl && backgroundImage && (
              <div className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-muted-foreground">Adjust QR placement</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={resetPlacement}
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="mockup-size">QR size</Label>
                    <span className="font-mono text-muted-foreground">{placement.size}%</span>
                  </div>
                  <Slider
                    id="mockup-size"
                    min={4}
                    max={60}
                    step={1}
                    value={[placement.size]}
                    onValueChange={([size]) => updatePlacement({ size: clampSize(size) })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="mockup-top">Vertical position</Label>
                    <span className="font-mono text-muted-foreground">{placement.top}%</span>
                  </div>
                  <Slider
                    id="mockup-top"
                    min={5}
                    max={95}
                    step={1}
                    value={[placement.top]}
                    onValueChange={([top]) => updatePlacement({ top })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="mockup-left">Horizontal position</Label>
                    <span className="font-mono text-muted-foreground">{placement.left}%</span>
                  </div>
                  <Slider
                    id="mockup-left"
                    min={5}
                    max={95}
                    step={1}
                    value={[placement.left]}
                    onValueChange={([left]) => updatePlacement({ left })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
