export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authenticateApiRequest, isAuthError, apiError, apiSuccess } from '@/lib/api-auth';
import { parseApiBody, serializeQR } from '@/lib/api-serialize';
import { generateShortCode, buildQRPayload } from '@/lib/qr-utils';
import { stripMetaFields } from '@/lib/industry-templates';
import { normalizeLabels } from '@/lib/organize-utils';
import { resolveApiWorkspaceId } from '@/lib/workspace';
import { assertCanCreateQr, getUserPlanUsage } from '@/lib/plan-usage';
import { assertQrUrlsAllowed } from '@/lib/validate-qr-urls';
import { BULK_ABSOLUTE_MAX_ROWS, parseBulkCSV } from '@/lib/bulk-csv';
import { resolveBulkFolderId } from '@/lib/bulk-folder';
import { getPrimaryScanBaseUrl } from '@/lib/custom-domain';

async function uniqueShortCode(): Promise<string> {
  for (let i = 0; i < 15; i++) {
    const shortCode = generateShortCode();
    const exists = await prisma.qRCode.findUnique({ where: { shortCode }, select: { id: true } });
    if (!exists) return shortCode;
  }
  throw new Error('Could not generate short code');
}

type WorkRow = {
  line: number;
  name: string;
  category: string;
  qrData: Record<string, string>;
  password?: string;
  expiresAt?: string | null;
  scanLimit?: number | null;
  folderId?: string | null;
  folderName?: string;
  labels?: string[];
  isActive?: boolean;
  style?: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  const auth = await authenticateApiRequest(req);
  if (isAuthError(auth)) return auth;

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const batchLabel =
      (typeof body.batch_label === 'string' ? body.batch_label : null)?.trim() ||
      (typeof body.batchLabel === 'string' ? body.batchLabel : null)?.trim() ||
      null;
    const batchStyle = (body.style ?? {}) as Record<string, unknown>;
    const workspaceParam =
      (body.workspace_id as string | undefined) ?? (body.workspaceId as string | undefined);

    const ws = await resolveApiWorkspaceId(auth.userId, workspaceParam, 'editor');
    if (!ws.ok) return apiError(ws.error, 403);

    const usage = await getUserPlanUsage(auth.userId);
    const bulkCap = Math.min(BULK_ABSOLUTE_MAX_ROWS, usage.plan.maxBulkRows);

    const rows: WorkRow[] = [];
    const parseErrors: { line: number; message: string }[] = [];

    if (typeof body.csv === 'string' && body.csv.trim()) {
      const parsed = parseBulkCSV(body.csv, bulkCap);
      parseErrors.push(...parsed.errors);
      for (const row of parsed.rows) {
        rows.push({
          line: row.line,
          name: row.name,
          category: row.category,
          qrData: row.qrData,
          password: row.password,
          expiresAt: row.expiresAt ?? null,
          scanLimit: row.scanLimit ?? null,
          folderName: row.folderName,
          labels: row.labels,
          style: batchStyle,
        });
      }
    }

    const items = (body.items ?? body.rows) as unknown;
    if (Array.isArray(items)) {
      items.forEach((raw, idx) => {
        const line = idx + 1;
        if (!raw || typeof raw !== 'object') {
          parseErrors.push({ line, message: 'Item must be an object' });
          return;
        }
        const item = raw as Record<string, unknown>;
        const parsed = parseApiBody(item);
        if (!parsed.name?.trim()) {
          parseErrors.push({ line, message: 'name is required' });
          return;
        }
        if (!parsed.category?.trim()) {
          parseErrors.push({ line, message: 'category is required' });
          return;
        }
        const qrData = stripMetaFields({ ...(parsed.qrData ?? {}) } as Record<string, string>);
        if (parsed.url && parsed.category === 'url') qrData.url = parsed.url;
        const targetUrl = buildQRPayload(parsed.category, qrData);
        if (!targetUrl?.trim()) {
          parseErrors.push({ line, message: 'qr_data or url is required for this category' });
          return;
        }
        const urlCheck = assertQrUrlsAllowed(parsed.category, qrData);
        if (!urlCheck.ok) {
          parseErrors.push({ line, message: urlCheck.error });
          return;
        }
        rows.push({
          line,
          name: parsed.name.trim(),
          category: parsed.category,
          qrData,
          password: typeof item.password === 'string' ? item.password : undefined,
          expiresAt:
            typeof item.expires_at === 'string'
              ? item.expires_at
              : typeof item.expiresAt === 'string'
                ? item.expiresAt
                : null,
          scanLimit:
            typeof item.scan_limit === 'number'
              ? item.scan_limit
              : typeof item.scanLimit === 'number'
                ? item.scanLimit
                : null,
          folderId: parsed.folderId ?? null,
          folderName: typeof item.folder === 'string' ? item.folder : undefined,
          labels: Array.isArray(parsed.labels)
            ? (parsed.labels as string[])
            : undefined,
          isActive: parsed.isActive !== false,
          style: (parsed.style ?? batchStyle) as Record<string, unknown>,
        });
      });
    }

    if (parseErrors.length > 0 && rows.length === 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors: parseErrors },
        { status: 400, headers: auth.rateLimitHeaders }
      );
    }
    if (typeof body.csv === 'string' && body.csv.trim() && parseErrors.length > 0 && !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'CSV validation failed', errors: parseErrors },
        { status: 400, headers: auth.rateLimitHeaders }
      );
    }

    if (!rows.length) {
      return apiError('No valid rows to import. Provide items[] or csv.', 400, auth.rateLimitHeaders);
    }

    if (rows.length > bulkCap) {
      return apiError(
        `Maximum ${bulkCap} rows per import on your ${usage.plan.name} plan`,
        400,
        auth.rateLimitHeaders
      );
    }

    const slotsLeft = usage.qrLimit - usage.qrCodes;
    if (rows.length > slotsLeft) {
      return apiError(
        `Not enough QR slots (${slotsLeft} remaining of ${usage.qrLimit}). Delete codes or upgrade your plan.`,
        403,
        auth.rateLimitHeaders
      );
    }

    // Pre-validate folder_ids
    const folderIds = Array.from(
      new Set(rows.map((r) => r.folderId).filter((id): id is string => Boolean(id)))
    );
    if (folderIds.length) {
      const found = await prisma.qRFolder.findMany({
        where: { userId: auth.userId, id: { in: folderIds } },
        select: { id: true },
      });
      const ok = new Set(found.map((f) => f.id));
      for (const id of folderIds) {
        if (!ok.has(id)) return apiError(`folder_id not found: ${id}`, 400, auth.rateLimitHeaders);
      }
    }

    const preFailed = [...parseErrors];
    const batchId = crypto.randomBytes(8).toString('hex');
    const created: ReturnType<typeof serializeQR>[] = [];
    const failed: { line: number; message: string }[] = [...preFailed];
    const folderCache = new Map<string, string>();
    const scanBase = await getPrimaryScanBaseUrl(auth.userId);

    for (const row of rows) {
      const slotCheck = await assertCanCreateQr(auth.userId);
      if (!slotCheck.ok) {
        failed.push({ line: row.line, message: slotCheck.error });
        continue;
      }

      try {
        const urlCheck = assertQrUrlsAllowed(row.category, row.qrData);
        if (!urlCheck.ok) {
          failed.push({ line: row.line, message: urlCheck.error });
          continue;
        }

        const shortCode = await uniqueShortCode();
        const targetUrl = buildQRPayload(row.category, row.qrData);
        const hashedPassword = row.password ? await bcrypt.hash(String(row.password), 10) : null;
        const folderId =
          row.folderId ||
          (await resolveBulkFolderId(auth.userId, ws.workspaceId, row.folderName, folderCache));
        const labels = normalizeLabels(row.labels ?? []);

        const qrCode = await prisma.qRCode.create({
          data: {
            userId: auth.userId,
            workspaceId: ws.workspaceId,
            name: row.name,
            shortCode,
            category: row.category,
            targetUrl,
            qrData: row.qrData,
            style: (row.style ?? batchStyle) as object,
            batchId,
            batchLabel,
            folderId,
            labels,
            password: hashedPassword,
            expiresAt: row.expiresAt ? new Date(row.expiresAt) : null,
            scanLimit: row.scanLimit ?? null,
            isActive: row.isActive !== false,
          },
          include: { folder: { select: { id: true, name: true, color: true } } },
        });

        created.push(serializeQR({ ...qrCode, userId: auth.userId }, scanBase));
      } catch (e: unknown) {
        failed.push({ line: row.line, message: e instanceof Error ? e.message : 'Create failed' });
      }
    }

    return apiSuccess(
      {
        batch_id: batchId,
        batch_label: batchLabel,
        created,
        failed,
        summary: {
          total: rows.length + preFailed.length,
          success: created.length,
          failed: failed.length,
        },
      },
      200,
      auth.rateLimitHeaders
    );
  } catch (error) {
    console.error('API v1 QR bulk error:', error);
    return apiError('Internal server error', 500);
  }
}
