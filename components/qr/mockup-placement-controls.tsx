'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { clampMockupSize, type MockupPlacement } from '@/lib/mockup-presets';

type MockupPlacementControlsProps = {
  placement: MockupPlacement;
  onUpdate: (patch: Partial<MockupPlacement>) => void;
  onReset: () => void;
};

export function MockupPlacementControls({ placement, onUpdate, onReset }: MockupPlacementControlsProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">Adjust QR placement</p>
        <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={onReset}>
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
          onValueChange={([size]) => onUpdate({ size: clampMockupSize(size) })}
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
          onValueChange={([top]) => onUpdate({ top })}
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
          onValueChange={([left]) => onUpdate({ left })}
        />
      </div>
    </div>
  );
}
