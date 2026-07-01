export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isWorkspaceSamlConfigured, getSamlIssuer } from '@/lib/saml-sp';

export async function GET(req: NextRequest) {
  const workspaceSlug = req.nextUrl.searchParams.get('workspace')?.trim();
  if (!workspaceSlug) {
    return NextResponse.json({ error: 'workspace_required' }, { status: 400 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: {
      name: true,
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
    !workspace.ssoEnabled ||
    workspace.ssoProvider !== 'saml' ||
    !isWorkspaceSamlConfigured(workspace)
  ) {
    return NextResponse.json({ enabled: false });
  }

  return NextResponse.json({
    enabled: true,
    name: workspace.name,
    slug: workspace.slug,
    metadataUrl: getSamlIssuer(workspace.slug),
    loginUrl: `/api/auth/saml/login?workspace=${encodeURIComponent(workspace.slug)}`,
  });
}
