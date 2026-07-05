export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { buildSamlInstance, isWorkspaceSamlConfigured } from '@/lib/saml-sp';

export async function GET(req: NextRequest) {
  const workspaceSlug = req.nextUrl.searchParams.get('workspace')?.trim();
  if (!workspaceSlug) {
    return NextResponse.json({ error: 'workspace_required' }, { status: 400 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: {
      slug: true,
      ssoEnabled: true,
      ssoProvider: true,
      idpEntityId: true,
      idpSsoUrl: true,
      idpCertificate: true,
      isPersonal: true,
    },
  });

  if (
    !workspace ||
    workspace.isPersonal ||
    workspace.ssoProvider !== 'saml' ||
    !isWorkspaceSamlConfigured(workspace)
  ) {
    return NextResponse.json({ error: 'saml_not_configured' }, { status: 404 });
  }

  const saml = buildSamlInstance(workspace);
  if (!saml) {
    return NextResponse.json({ error: 'saml_not_configured' }, { status: 404 });
  }

  const cert = process.env.SAML_SP_CERT?.replace(/\\n/g, '\n') ?? null;
  const metadata = saml.generateServiceProviderMetadata(null, cert);

  return new NextResponse(metadata, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
