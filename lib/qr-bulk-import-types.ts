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

export const defaultBulkUsage: UsageInfo = {
  maxBulkRows: 100,
  qrLimit: 25,
  qrCodes: 0,
  planId: 'free',
};
