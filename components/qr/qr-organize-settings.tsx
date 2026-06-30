'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { FolderOpen, Tag, X } from 'lucide-react';
import { MAX_LABELS_PER_QR, normalizeLabels } from '@/lib/organize-utils';

export interface QRFolderOption {
  id: string;
  name: string;
  color: string;
  qrCount?: number;
}

interface QROrganizeSettingsProps {
  folderId: string | null;
  labels: string[];
  onFolderChange: (folderId: string | null) => void;
  onLabelsChange: (labels: string[]) => void;
}

export function QROrganizeSettings({
  folderId,
  labels,
  onFolderChange,
  onLabelsChange,
}: QROrganizeSettingsProps) {
  const [folders, setFolders] = useState<QRFolderOption[]>([]);
  const [labelInput, setLabelInput] = useState('');

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

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
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <FolderOpen className="h-5 w-5 text-primary" /> Organization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Folder</Label>
          <Select
            value={folderId ?? '__none__'}
            onValueChange={(v) => onFolderChange(v === '__none__' ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="No folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">No folder</SelectItem>
              {folders.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                    {f.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
      </CardContent>
    </Card>
  );
}
