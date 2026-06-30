import { normalizeLabels } from '@/lib/organize-utils';
import { buildScanUrl, DEFAULT_SITE_URL, getPrimaryScanBaseUrl } from '@/lib/custom-domain';

export function serializeQR(
  qr: {
    id: string;
    userId?: string;
    name: string;
    shortCode: string;
  category: string;
  targetUrl: string;
  qrData: unknown;
  style: unknown;
  logoPath: string | null;
  isActive: boolean;
  totalScans: number;
  expiresAt: Date | null;
  scanLimit: number | null;
  folderId: string | null;
  labels: unknown;
  batchId: string | null;
  batchLabel: string | null;
  createdAt: Date;
  updatedAt: Date;
  password?: string | null;
  folder?: { id: string; name: string; color: string } | null;
},
  scanBaseUrl?: string
) {
  const { password, ...rest } = qr;
  const base = scanBaseUrl || DEFAULT_SITE_URL;
  return {
    id: rest.id,
    name: rest.name,
    short_code: rest.shortCode,
    scan_url: buildScanUrl(rest.shortCode, base),
    category: rest.category,
    target_url: rest.targetUrl,
    qr_data: rest.qrData,
    style: rest.style,
    logo_path: rest.logoPath,
    is_active: rest.isActive,
    total_scans: rest.totalScans,
    has_password: Boolean(password),
    expires_at: rest.expiresAt?.toISOString() ?? null,
    scan_limit: rest.scanLimit,
    folder_id: rest.folderId,
    folder: rest.folder
      ? { id: rest.folder.id, name: rest.folder.name, color: rest.folder.color }
      : null,
    labels: normalizeLabels(rest.labels),
    batch_id: rest.batchId,
    batch_label: rest.batchLabel,
    created_at: rest.createdAt.toISOString(),
    updated_at: rest.updatedAt.toISOString(),
  };
}

export async function serializeQRForUser(
  qr: Parameters<typeof serializeQR>[0] & { userId: string },
  scanBaseUrl?: string
) {
  const base = scanBaseUrl ?? (await getPrimaryScanBaseUrl(qr.userId));
  return serializeQR(qr, base);
}

export function serializeFolder(folder: {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: { qrCodes: number };
}) {
  return {
    id: folder.id,
    name: folder.name,
    color: folder.color,
    qr_count: folder._count?.qrCodes ?? 0,
    created_at: folder.createdAt.toISOString(),
    updated_at: folder.updatedAt.toISOString(),
  };
}

/** Accept both snake_case and camelCase from API clients */
export function parseApiBody(body: Record<string, unknown>) {
  return {
    name: (body.name ?? body.title) as string | undefined,
    category: body.category as string | undefined,
    qrData: (body.qr_data ?? body.qrData) as Record<string, unknown> | undefined,
    style: body.style as Record<string, unknown> | undefined,
    isActive: body.is_active ?? body.isActive,
    folderId: (body.folder_id ?? body.folderId) as string | null | undefined,
    labels: body.labels,
    url: body.url as string | undefined,
  };
}
