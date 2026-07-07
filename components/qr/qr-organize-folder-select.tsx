'use client';

import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/components/i18n/language-provider';
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
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label>{t('organize.folder')}</Label>
      <Select
        value={folderId ?? '__none__'}
        onValueChange={(v) => onFolderChange(v === '__none__' ? null : v)}
      >
        <SelectTrigger>
          <SelectValue>
            {folderId == null
              ? t('organize.noFolder')
              : folders.find((f) => f.id === folderId)?.name ?? t('organize.noFolder')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">{t('organize.noFolder')}</SelectItem>
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
