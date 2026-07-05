'use client';

import { useQrBulkImport } from '@/hooks/use-qr-bulk-import';
import { BulkImportHeader } from './bulk-import-header';
import { BulkImportResult } from './bulk-import-result';
import { BulkImportUpload } from './bulk-import-upload';
import { BulkImportPreview } from './bulk-import-preview';

export function QRBulkImport() {
  const bulk = useQrBulkImport();

  return (
    <div className="space-y-6">
      <BulkImportHeader bulk={bulk} />
      {bulk.result ? (
        <BulkImportResult bulk={bulk} />
      ) : (
        <>
          <BulkImportUpload bulk={bulk} />
          <BulkImportPreview bulk={bulk} />
        </>
      )}
    </div>
  );
}
