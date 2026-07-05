import type { QRStyleConfig } from '@/lib/qr-style';
import type { IndustryPrintLayout } from '@/lib/industry-print-layouts';

export interface QRPreviewProps {
  category: string;
  qrData: Record<string, string>;
  style: Partial<QRStyleConfig> | Record<string, unknown>;
  logoPreview: string | null;
  shortCode?: string;
  qrName?: string;
  accentColor?: string;
  showExtras?: boolean;
  showScanTest?: boolean;
  showPrintBanner?: boolean;
  printLayout?: IndustryPrintLayout;
  industryTemplateId?: string;
  onStyleChange?: (style: QRStyleConfig) => void;
}
