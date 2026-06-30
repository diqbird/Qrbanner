import { promises as fs } from 'fs';
import path from 'path';

/**
 * VPS-portable file storage.
 *
 * Files are written to the `public/uploads` directory so they are served
 * directly by the Next.js server (works in `next dev` and `next start` on a VPS).
 * No external cloud provider is required.
 *
 * The returned `path` is a public URL path (e.g. `/uploads/162...-logo.png`)
 * that can be used directly in <img src> and embedded into QR previews.
 */

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function sanitizeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}`;
}

export async function saveUploadedFile(
  buffer: Buffer,
  originalName: string
): Promise<{ path: string }> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = sanitizeFileName(originalName || 'file');
  const fullPath = path.join(UPLOAD_DIR, fileName);
  await fs.writeFile(fullPath, buffer);
  return { path: `/uploads/${fileName}` };
}

export async function deleteUploadedFile(publicPath: string): Promise<void> {
  try {
    if (!publicPath || !publicPath.startsWith('/uploads/')) return;
    const fileName = publicPath.replace('/uploads/', '');
    // Prevent path traversal
    if (fileName.includes('..') || fileName.includes('/')) return;
    const fullPath = path.join(UPLOAD_DIR, fileName);
    await fs.unlink(fullPath);
  } catch {
    // Ignore deletion errors (file may not exist)
  }
}
