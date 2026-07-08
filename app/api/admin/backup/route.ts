export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiAdmin, isAuthError } from '@/lib/api-route-auth';

const BACKUP_DIR = process.env.QRBANNER_BACKUP_DIR || '/var/backups/qrbanner';

type BackupFile = { name: string; sizeBytes: number; createdAt: string };

function listBackups(): { available: boolean; files: BackupFile[] } {
  try {
    const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith('.sql.gz'))
      .map((e) => {
        const stat = fs.statSync(path.join(BACKUP_DIR, e.name));
        return {
          name: e.name,
          sizeBytes: stat.size,
          createdAt: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 30);
    return { available: true, files };
  } catch {
    return { available: false, files: [] };
  }
}

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthError(auth)) return auth;

  const [users, qrCodes, scans, workspaces, leads] = await Promise.all([
    prisma.user.count(),
    prisma.qRCode.count(),
    prisma.qRScan.count(),
    prisma.workspace.count(),
    prisma.leadSubmission.count(),
  ]);

  const backups = listBackups();

  return NextResponse.json({
    tables: { users, qrCodes, scans, workspaces, leads },
    backupDir: BACKUP_DIR,
    backupsAvailable: backups.available,
    backups: backups.files,
    schedule: '0 3 * * * (daily 03:00, 14-day retention)',
  });
}
