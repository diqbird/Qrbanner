'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Split, Plus } from 'lucide-react';
import {
  type AbTestData,
  emptyAbTestData,
  sanitizeAbTestData,
} from '@/lib/ab-routing';
import { AbTestVariantRow } from './ab-test-variant-row';

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

  const setVariant = (index: number, patch: Partial<(typeof variants)[number]>) => {
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
      }),
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
            <AbTestVariantRow
              key={v.id}
              variant={v}
              index={i}
              defaultUrl={defaultUrl}
              canRemove={variants.length > 2}
              onUpdate={setVariant}
              onRemove={removeVariant}
            />
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
