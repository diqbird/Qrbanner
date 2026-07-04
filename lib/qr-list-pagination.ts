export const QR_LIST_DEFAULT_LIMIT = 50;
export const QR_LIST_MAX_LIMIT = 100;

export function parseQrListPagination(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const rawLimit = Number.parseInt(searchParams.get('limit') ?? String(QR_LIST_DEFAULT_LIMIT), 10);
  const limit = Math.min(
    QR_LIST_MAX_LIMIT,
    Math.max(1, Number.isFinite(rawLimit) ? rawLimit : QR_LIST_DEFAULT_LIMIT)
  );
  return { page, limit, skip: (page - 1) * limit };
}
