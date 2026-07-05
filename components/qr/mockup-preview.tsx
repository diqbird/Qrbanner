'use client';

import { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shirt, CreditCard, Image, Coffee, Upload, Move, Minus, Plus, Maximize2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  MOCKUP_PRESETS,
  getMockupPreset,
  type MockupKey,
  type MockupPresetId,
} from '@/lib/mockup-presets';
import { useMockupPlacement } from '@/hooks/use-mockup-placement';
import { MockupPlacementControls } from './mockup-placement-controls';

const PRESET_ICONS = {
  card: CreditCard,
  poster: Image,
  shirt: Shirt,
  mug: Coffee,
} as const;

export function MockupPreview({ qrDataUrl }: { qrDataUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<MockupKey>('poster');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    containerRef,
    placement,
    dragging,
    resizing,
    updatePlacement,
    resetPlacement,
    onQrPointerDown,
    onQrPointerMove,
    onQrPointerUp,
    onResizeHandleDown,
    onQrWheel,
    nudgeSize,
    initCustomPlacement,
  } = useMockupPlacement(active);

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
      initCustomPlacement();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const selectPreset = (id: MockupPresetId) => setActive(id);

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
              {MOCKUP_PRESETS.map((m) => {
                const Icon = PRESET_ICONS[m.id];
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectPreset(m.id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      active === m.id
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {m.label}
                  </button>
                );
              })}
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
                  onPointerDown={(e) => onQrPointerDown(e, Boolean(qrDataUrl))}
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
                    ].map((sizePreset) => (
                      <Button
                        key={sizePreset.label}
                        type="button"
                        variant={Math.abs(placement.size - sizePreset.size) < 2 ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => updatePlacement({ size: sizePreset.size })}
                      >
                        {sizePreset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {qrDataUrl && backgroundImage && (
              <MockupPlacementControls
                placement={placement}
                onUpdate={updatePlacement}
                onReset={resetPlacement}
              />
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
