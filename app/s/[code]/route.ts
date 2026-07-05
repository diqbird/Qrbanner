export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getQrForScan } from '@/lib/scan-redirect-cache';
import { draftPreviewPage, passwordPage } from '@/lib/scan/scan-html';
import { runGuards, assertCustomDomainAccess } from '@/lib/scan/scan-guards';
import { handleScan } from '@/lib/scan/handle-scan';

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const shortCode = params?.code ?? '';
    if (!shortCode) return NextResponse.redirect(new URL('/', req.url));

    if (shortCode === 'draft-preview') {
      return draftPreviewPage();
    }

    const qrCode = await getQrForScan(shortCode);
    const guard = runGuards(qrCode);
    if (guard) return guard;

    const domainGuard = await assertCustomDomainAccess(req, qrCode!);
    if (domainGuard) return domainGuard;

    if (qrCode!.password && req.nextUrl.searchParams.get('go') !== '1') {
      return passwordPage(shortCode);
    }

    return await handleScan(qrCode!, req, false);
  } catch (error) {
    console.error('Scan redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const shortCode = params?.code ?? '';
    if (!shortCode) return NextResponse.redirect(new URL('/', req.url));

    const qrCode = await getQrForScan(shortCode);
    const guard = runGuards(qrCode);
    if (guard) return guard;

    const domainGuard = await assertCustomDomainAccess(req, qrCode!);
    if (domainGuard) return domainGuard;

    if (!qrCode!.password) {
      return await handleScan(qrCode!, req, false);
    }

    const formData = await req.formData();
    const password = String(formData.get('password') ?? '');
    const valid = await bcrypt.compare(password, qrCode!.password);

    if (!valid) {
      return passwordPage(shortCode, true);
    }

    return await handleScan(qrCode!, req, false);
  } catch (error) {
    console.error('Scan POST error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
