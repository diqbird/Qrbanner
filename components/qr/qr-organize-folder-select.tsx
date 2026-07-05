'use client';

import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { QRFolderOption } from '@/lib/qr-organize-types';

export function QrOrganizeFolderSelect({
  folders,
  folderId,
  onFolderChange,
}: {
  folders: QRFolderOption[];
  folderId: string | null;
  onFolderChange: (folderId: string | null) => void;
}) {
  return (
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
  );
}
