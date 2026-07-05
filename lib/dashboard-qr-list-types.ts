export interface ListMeta {
  labels: string[];
  batches: { id: string; name: string }[];
}

export interface ListTotals {
  accountQrCount: number;
  accountActiveCount: number;
  accountTotalScans: number;
  filteredTotal: number;
  filteredScans: number;
  filteredActive: number;
}

export interface ListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
