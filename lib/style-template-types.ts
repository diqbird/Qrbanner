import type { QRStyleConfig } from '@/lib/qr-style';

export interface StyleTemplateRow {
  id: string;
  name: string;
  style: QRStyleConfig;
  logoPath: string | null;
}
