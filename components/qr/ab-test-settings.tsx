'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Split, Plus, Trash2 } from 'lucide-react';
import {
  type AbTestData,
  type AbVariant,
  emptyAbTestData,
  sanitizeAbTestData,
} from '@/lib/ab-routing';

export function AbTestSettings({
  enabled,
  onEnabledChange,
  data,
  onChange,
  defaultUrl,
}: {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  data: AbTestData;
  onChange: (v: AbTestData) => void;
  defaultUrl?: string;
}) {
  const variants = data.variants ?? emptyAbTestData.variants;

  const setVariant = (index: number, patch: Partial<AbVariant>) => {
    const next = variants.map((v, i) => (i === index ? { ...v, ...patch } : v));
    onChange(sanitizeAbTestData({ ...data, variants: next }));
  };

  const addVariant = () => {
    if (variants.length >= 5) return;
    onChange(
      sanitizeAbTestData({
        ...data,
        variants: [
          ...variants,
          { id: `v${variants.length + 1}`, label: `Variant ${variants.length + 1}`, url: '', weight: 10 },
        ],
      })
    );
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 2) return;
    onChange(sanitizeAbTestData({ ...data, variants: variants.filter((_, i) => i !== index) }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2">
            <Split className="h-5 w-5 text-primary" /> Split Testing (A/B)
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <p className="text-sm text-muted-foreground">
          Test two different links and see which one performs better with your audience.
        </p>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between text-sm">
            <span>Sticky assignment (cookie)</span>
            <Switch
              checked={data.sticky !== false}
              onCheckedChange={(v) => onChange({ ...data, sticky: v })}
            />
          </label>
          {variants.map((v, i) => (
            <div key={v.id} className="grid gap-3 rounded-lg border border-border/50 p-3 sm:grid-cols-[1fr_2fr_80px_36px]">
              <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input value={v.label} onChange={(e) => setVariant(i, { label: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL</Label>
                <Input
                  placeholder={defaultUrl || 'https://...'}
                  value={v.url}
                  onChange={(e) => setVariant(i, { url: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Weight %</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={v.weight}
                  onChange={(e) => setVariant(i, { weight: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={variants.length <= 2}
                  onClick={() => removeVariant(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {variants.length < 5 && (
            <Button type="button" variant="outline" size="sm" onClick={addVariant} className="gap-1">
              <Plus className="h-4 w-4" /> Add variant
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export { emptyAbTestData };
