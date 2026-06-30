export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateShortCode, buildQRPayload } from '@/lib/qr-utils';
import { BULK_ABSOLUTE_MAX_ROWS, parseBulkCSV, type BulkParsedRow } from '@/lib/bulk-csv';
import { assertCanCreateQr, getUserPlanUsage } from '@/lib/plan-usage';
import { getActiveWorkspaceId, assertWorkspaceRole } from '@/lib/workspace';
import { BULK_LIMIT, rateLimitRequest } from '@/lib/authenticated-rate-limit';

async function uniqueShortCode(): Promise<string> {
  for (let attempt = 0; attempt < 15; attempt++) {
    const shortCode = generateShortCode();
    const exists = await prisma.qRCode.findUnique({
      where: { shortCode },
      select: { id: true },
    });
    if (!exists) return shortCode;
  }
  throw new Error('Could not generate unique short code');
}

interface BulkCreateInput {
  batchLabel?: string;
  style?: Record<string, unknown>;
  rows?: BulkParsedRow[];
  csv?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string })?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limited = await rateLimitRequest(req, 'qr-bulk', BULK_LIMIT.limit, BULK_LIMIT.windowMs, userId);
    if (limited) return limited;

    const workspaceId = await getActiveWorkspaceId(userId);
    const wsAccess = await assertWorkspaceRole(userId, workspaceId, 'editor');
    if (!wsAccess.ok) {
      return NextResponse.json({ error: wsAccess.error }, { status: 403 });
    }

    const body = (await req.json()) as BulkCreateInput;
    const batchLabel = body.batchLabel?.trim() || null;
    const style = (body.style ?? {}) as object;

    const usage = await getUserPlanUsage(userId);
    const bulkCap = Math.min(BULK_ABSOLUTE_MAX_ROWS, usage.plan.maxBulkRows);

    let rows: BulkParsedRow[] = body.rows ?? [];
    const parseErrors: { line: number; message: string }[] = [];

    if (body.csv) {
      const parsed = parseBulkCSV(body.csv, bulkCap);
      parseErrors.push(...parsed.errors);
      rows = parsed.rows;
    }

    if (parseErrors.length > 0) {
      return NextResponse.json({ error: 'CSV validation failed', errors: parseErrors }, { status: 400 });
    }

    if (!rows.length) {
      return NextResponse.json({ error: 'No valid rows to import' }, { status: 400 });
    }

    if (rows.length > bulkCap) {
      return NextResponse.json(
        { error: `Maximum ${bulkCap} rows per import on your ${usage.plan.name} plan` },
        { status: 400 }
      );
    }

    const slotsLeft = usage.qrLimit - usage.qrCodes;
    if (rows.length > slotsLeft) {
      return NextResponse.json(
        {
          error: `Not enough QR slots (${slotsLeft} remaining of ${usage.qrLimit}). Delete codes or upgrade your plan.`,
        },
        { status: 403 }
      );
    }

    const batchId = crypto.randomBytes(8).toString('hex');
    const created: { id: string; name: string; shortCode: string; category: string }[] = [];
    const rowErrors: { line: number; message: string }[] = [];

    for (const row of rows) {
      const slotCheck = await assertCanCreateQr(userId);
      if (!slotCheck.ok) {
        rowErrors.push({ line: row.line, message: slotCheck.error });
        continue;
      }

      try {
        const shortCode = await uniqueShortCode();
        const targetUrl = buildQRPayload(row.category, row.qrData);
        const hashedPassword = row.password ? await bcrypt.hash(String(row.password), 10) : null;

        const qrCode = await prisma.qRCode.create({
          data: {
            userId,
            workspaceId,
            name: row.name,
            shortCode,
            category: row.category,
            targetUrl,
            qrData: row.qrData,
            style,
            batchId,
            batchLabel,
            password: hashedPassword,
            expiresAt: row.expiresAt ? new Date(row.expiresAt) : null,
            scanLimit: row.scanLimit ?? null,
          },
          select: {
            id: true,
            name: true,
            shortCode: true,
            category: true,
          },
        });

        created.push(qrCode);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Create failed';
        rowErrors.push({ line: row.line, message });
      }
    }

    return NextResponse.json({
      batchId,
      batchLabel,
      created,
      failed: rowErrors,
      summary: {
        total: rows.length,
        success: created.length,
        failed: rowErrors.length,
      },
    });
  } catch (error: unknown) {
    console.error('Bulk QR create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
