export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/storage';
import { verifyImageMagicBytes } from '@/lib/file-magic';
import { prisma } from '@/lib/db';
import { requireUserId, isAuthError } from '@/lib/session-auth';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB for logos
const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserId();
    if (isAuthError(auth)) return auth;
    const userId = auth;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Use PNG, JPG, WEBP or GIF.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!verifyImageMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: 'File content does not match its type. Upload a valid image.' },
        { status: 400 }
      );
    }

    const { path: filePath } = await saveUploadedFile(buffer, file.name, file.type);

    try {
        await prisma.mediaAsset.create({
          data: {
            userId,
            filename: file.name,
            url: filePath,
            mimeType: file.type,
            sizeBytes: file.size,
          },
        });
      } catch {
        /* MediaAsset table may not exist yet */
      }

    return NextResponse.json({ path: filePath });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
