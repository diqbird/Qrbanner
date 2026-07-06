'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';
import { useLanguage } from '@/components/i18n/language-provider';
import { useQrOrganizeFolders } from '@/hooks/use-qr-organize-folders';
import { QrOrganizeFolderSelect, QrOrganizeLabelsEditor } from './qr-organize-settings-panels';

export type { QRFolderOption } from '@/lib/qr-organize-types';

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
  const { t } = useLanguage();
  const { folders } = useQrOrganizeFolders();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <FolderOpen className="h-5 w-5 text-primary" /> {t('organize.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <QrOrganizeFolderSelect folders={folders} folderId={folderId} onFolderChange={onFolderChange} />
        <QrOrganizeLabelsEditor labels={labels} onLabelsChange={onLabelsChange} />
      </CardContent>
    </Card>
  );
}
