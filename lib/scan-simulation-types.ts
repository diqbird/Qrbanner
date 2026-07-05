export type ScanStatus = 'idle' | 'running' | 'pass' | 'warn' | 'fail';

export interface ScanResult {
  status: ScanStatus;
  title: string;
  detail: string;
  decoded?: string;
  confidence?: import('@/lib/qr-scan-decode').DecodeConfidence;
}
