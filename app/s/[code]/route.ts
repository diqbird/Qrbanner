export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getQrForScan } from '@/lib/scan-redirect-cache';
import { pickScanLocale } from '@/lib/i18n/resolve-scan-page-copy';
import { draftPreviewPage, passwordPage } from '@/lib/scan/scan-html';
import { runGuards, assertCustomDomainAccess } from '@/lib/scan/scan-guards';
import { handleScan } from '@/lib/scan/handle-scan';

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const locale = pickScanLocale(req.headers.get('accept-language'));
    const shortCode = params?.code ?? '';
    if (!shortCode) return NextResponse.redirect(new URL('/', req.url));

    if (shortCode === 'draft-preview') {
      return draftPreviewPage(locale);
    }

    const qrCode = await getQrForScan(shortCode);
    const guard = runGuards(qrCode, locale);
    if (guard) return guard;

    const domainGuard = await assertCustomDomainAccess(req, qrCode!, locale);
    if (domainGuard) return domainGuard;

    if (qrCode!.password && req.nextUrl.searchParams.get('go') !== '1') {
      return passwordPage(shortCode, false, locale);
    }

    return await handleScan(qrCode!, req, false);
  } catch (error) {
    console.error('Scan redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const locale = pickScanLocale(req.headers.get('accept-language'));
    const shortCode = params?.code ?? '';
    if (!shortCode) return NextResponse.redirect(new URL('/', req.url));

    const qrCode = await getQrForScan(shortCode);
    const guard = runGuards(qrCode, locale);
    if (guard) return guard;

    const domainGuard = await assertCustomDomainAccess(req, qrCode!, locale);
    if (domainGuard) return domainGuard;

    if (!qrCode!.password) {
      return await handleScan(qrCode!, req, false);
    }

    const formData = await req.formData();
    const password = String(formData.get('password') ?? '');
    const valid = await bcrypt.compare(password, qrCode!.password);

    if (!valid) {
      return passwordPage(shortCode, true, locale);
    }

    return await handleScan(qrCode!, req, false);
  } catch (error) {
    console.error('Scan POST error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
