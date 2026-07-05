'use client';

import type { QrBulkImportState } from '@/hooks/use-qr-bulk-import';
import { BulkImportTemplateCard } from './bulk-import-template-card';
import { BulkImportUploadCard } from './bulk-import-upload-card';
import { BulkImportErrorList } from './bulk-import-error-list';

type BulkImportUploadProps = {
  bulk: QrBulkImportState;
};

export function BulkImportUpload({ bulk }: BulkImportUploadProps) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <BulkImportTemplateCard bulk={bulk} />
        <BulkImportUploadCard bulk={bulk} />
      </div>
      <BulkImportErrorList bulk={bulk} />
    </>
  );
}
