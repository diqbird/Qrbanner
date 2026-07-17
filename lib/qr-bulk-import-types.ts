import { PLANS } from '@/lib/plans';

export interface CreatedQR {
  id: string;
  name: string;
  shortCode: string;
  category: string;
}

export interface BulkResult {
  batchId: string;
  batchLabel: string | null;
  created: CreatedQR[];
  failed: import('@/lib/bulk-csv').BulkParseError[];
  summary: { total: number; success: number; failed: number };
}

export interface UsageInfo {
  maxBulkRows: number;
  qrLimit: number;
  qrCodes: number;
  planId: string;
}

/** Optimistic free-plan defaults until `/api/qr/bulk` usage loads — keep in sync with `PLANS.free`. */
export const defaultBulkUsage: UsageInfo = {
  maxBulkRows: PLANS.free.maxBulkRows,
  qrLimit: PLANS.free.maxQrCodes,
  qrCodes: 0,
  planId: PLANS.free.id,
};
