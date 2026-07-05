'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, X } from 'lucide-react';
import { MAX_LABELS_PER_QR, normalizeLabels } from '@/lib/organize-utils';

export function QrOrganizeLabelsEditor({
  labels,
  onLabelsChange,
}: {
  labels: string[];
  onLabelsChange: (labels: string[]) => void;
}) {
  const [labelInput, setLabelInput] = useState('');

  const addLabel = () => {
    const next = normalizeLabels([...labels, labelInput]);
    if (next.length === labels.length) return;
    onLabelsChange(next);
    setLabelInput('');
  };

  const removeLabel = (label: string) => {
    onLabelsChange(labels.filter((l) => l !== label));
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Tag className="h-4 w-4" /> Labels
      </Label>
      <div className="flex gap-2">
        <Input
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          placeholder="Add label..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addLabel();
            }
          }}
          disabled={labels.length >= MAX_LABELS_PER_QR}
        />
        <Button type="button" variant="outline" onClick={addLabel} disabled={!labelInput.trim()}>
          Add
        </Button>
      </div>
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <Badge key={label} variant="secondary" className="gap-1 pr-1">
              {label}
              <button type="button" onClick={() => removeLabel(label)} className="rounded-full p-0.5 hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Up to {MAX_LABELS_PER_QR} labels. Separate with comma or press Enter.
      </p>
    </div>
  );
}
