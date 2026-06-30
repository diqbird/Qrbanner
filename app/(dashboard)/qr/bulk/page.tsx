import { QRBulkImport } from '@/components/qr/qr-bulk-import';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bulk QR Import',
  description: 'Create multiple dynamic QR codes at once from a CSV file.',
};

export default function BulkQRPage() {
  return <QRBulkImport />;
}
