export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { buildSamlInstance } from '@/lib/saml-sp';
import { absoluteSitePath } from '@/lib/request-site-url';

export async function GET(req: NextRequest) {
  const workspaceSlug = req.nextUrl.searchParams.get('workspace')?.trim();
  if (!workspaceSlug) {
    return NextResponse.redirect(absoluteSitePath(req, '/login?error=saml_workspace_required'));
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
    !workspace.ssoEnabled ||
    workspace.ssoProvider !== 'saml'
  ) {
    return NextResponse.redirect(absoluteSitePath(req, '/login?error=saml_not_configured'));
  }

  const saml = buildSamlInstance(workspace);
  if (!saml) {
    return NextResponse.redirect(absoluteSitePath(req, '/login?error=saml_not_configured'));
  }

  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? 'qrbanner.com';
  const authorizeUrl = await saml.getAuthorizeUrlAsync(workspace.slug, host, {});

  return NextResponse.redirect(authorizeUrl);
}
