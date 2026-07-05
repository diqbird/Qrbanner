import type { QRStyleConfig } from '@/lib/qr-style';

export interface BrandKitTemplate {
  id: string;
  name: string;
  style: QRStyleConfig;
  logoPath: string | null;
  updatedAt: string;
}
