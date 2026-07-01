export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  buildSamlInstance,
  extractSamlEmail,
  extractSamlName,
  extractSamlProviderAccountId,
} from '@/lib/saml-sp';
import { isEmailDomainAllowed, parseAllowedDomains } from '@/lib/workspace-sso';
import { createSamlSignInToken, provisionSamlUser } from '@/lib/saml-auth';
import { DEFAULT_SITE_URL } from '@/lib/custom-domain';

function loginRedirect(path: string): string {
  return `${DEFAULT_SITE_URL.replace(/\/$/, '')}${path}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const relayState = String(form.get('RelayState') ?? '').trim();
    const body: Record<string, string> = {};
    Array.from(form.entries()).forEach(([key, value]) => {
      body[key] = String(value);
    });

    if (!relayState) {
      return NextResponse.redirect(loginRedirect('/login?error=saml_workspace_required'));
    }

    const workspace = await prisma.workspace.findUnique({
      where: { slug: relayState },
      select: {
        id: true,
        slug: true,
        ssoEnabled: true,
        ssoProvider: true,
        allowedDomains: true,
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
      return NextResponse.redirect(loginRedirect('/login?error=saml_not_configured'));
    }

    const saml = buildSamlInstance(workspace);
    if (!saml) {
      return NextResponse.redirect(loginRedirect('/login?error=saml_not_configured'));
    }

    const { profile } = await saml.validatePostResponseAsync(body);
    const profileRecord = (profile ?? {}) as Record<string, unknown>;
    const email = extractSamlEmail(profileRecord);
    if (!email) {
      return NextResponse.redirect(loginRedirect('/login?error=saml_email_missing'));
    }

    const allowedDomains = parseAllowedDomains(workspace.allowedDomains);
    if (allowedDomains.length && !isEmailDomainAllowed(email, allowedDomains)) {
      return NextResponse.redirect(loginRedirect('/login?error=domain_not_allowed'));
    }

    const providerAccountId = extractSamlProviderAccountId(profileRecord);
    const name = extractSamlName(profileRecord);
    const { userId } = await provisionSamlUser({
      email,
      name,
      providerAccountId,
      workspaceId: workspace.id,
    });

    const token = createSamlSignInToken(userId, workspace.id);
    const callback = new URL(loginRedirect('/login'));
    callback.searchParams.set('samlToken', token);
    callback.searchParams.set('email', email);

    return NextResponse.redirect(callback.toString());
  } catch (err) {
    console.error('[saml] acs', err);
    return NextResponse.redirect(loginRedirect('/login?error=saml_assertion_failed'));
  }
}
