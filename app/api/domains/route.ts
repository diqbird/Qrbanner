export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';
import {
  normalizeDomain,
  generateVerifyToken,
  CNAME_TARGET,
  txtRecordName,
  txtRecordValue,
  getPrimaryScanBaseUrl,
} from '@/lib/custom-domain';
import { assertCanAddDomain } from '@/lib/plan-usage';

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string })?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const domains = await prisma.customDomain.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const scanBaseUrl = await getPrimaryScanBaseUrl(userId);

    return NextResponse.json({
      domains,
      scan_base_url: scanBaseUrl,
      cname_target: CNAME_TARGET,
    });
  } catch (error) {
    console.error('Domains list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const domain = normalizeDomain(body.domain ?? '');
    if (!domain || !domain.includes('.')) {
      return NextResponse.json({ error: 'Enter a valid domain (e.g. qr.yourbrand.com)' }, { status: 400 });
    }

    if (domain === 'qrbanner.com' || domain.endsWith('.qrbanner.com')) {
      return NextResponse.json({ error: 'This domain cannot be used' }, { status: 400 });
    }

    const domainCheck = await assertCanAddDomain(userId);
    if (!domainCheck.ok) {
      return NextResponse.json({ error: domainCheck.error }, { status: 403 });
    }

    const count = await prisma.customDomain.count({ where: { userId } });

    const existing = await prisma.customDomain.findUnique({ where: { domain } });
    if (existing && existing.userId !== userId) {
      return NextResponse.json({ error: 'Domain is already registered' }, { status: 409 });
    }
    if (existing) {
      return NextResponse.json({ error: 'You already added this domain' }, { status: 409 });
    }

    const verifyToken = generateVerifyToken();
    const isFirst = count === 0;

    const record = await prisma.customDomain.create({
      data: {
        userId,
        domain,
        verifyToken,
        isPrimary: isFirst,
        status: 'pending',
      },
    });

    return NextResponse.json({
      domain: record,
      dns: {
        cname: { host: domain, value: CNAME_TARGET },
        txt: { host: txtRecordName(domain), value: txtRecordValue(verifyToken) },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Domain create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
