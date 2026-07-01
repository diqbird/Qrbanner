import { promises as fs } from 'fs';
import path from 'path';
import { isS3StorageEnabled } from './aws-config';
import { deleteFile, parseS3ObjectKeyFromUrl, uploadPublicBuffer } from './s3';

/**
 * VPS-portable file storage with optional S3 when `AWS_BUCKET_NAME` is set.
 *
 * Local mode writes to `public/uploads` (served by Next.js).
 * S3 mode uploads to `public/uploads/` in the bucket and returns the HTTPS URL.
 */

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function sanitizeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}`;
}

export async function saveUploadedFile(
  buffer: Buffer,
  originalName: string,
  contentType = 'application/octet-stream'
): Promise<{ path: string }> {
  if (isS3StorageEnabled()) {
    const publicUrl = await uploadPublicBuffer(buffer, originalName, contentType);
    return { path: publicUrl };
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = sanitizeFileName(originalName || 'file');
  const fullPath = path.join(UPLOAD_DIR, fileName);
  await fs.writeFile(fullPath, buffer);
  return { path: `/uploads/${fileName}` };
}

export async function deleteUploadedFile(publicPath: string): Promise<void> {
  try {
    if (!publicPath) return;

    const s3Key = parseS3ObjectKeyFromUrl(publicPath);
    if (s3Key && isS3StorageEnabled()) {
      await deleteFile(s3Key);
      return;
    }

    if (!publicPath.startsWith('/uploads/')) return;
    const fileName = publicPath.replace('/uploads/', '');
    if (fileName.includes('..') || fileName.includes('/')) return;
    const fullPath = path.join(UPLOAD_DIR, fileName);
    await fs.unlink(fullPath);
  } catch {
    // Ignore deletion errors (file may not exist)
  }
}
