import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { hashBearerToken } from '@/lib/secret-crypto';

export const SCIM_CONTENT_TYPE = 'application/scim+json';

export function scimJson(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': SCIM_CONTENT_TYPE },
  });
}

export function scimError(detail: string, status: number) {
  return scimJson(
    {
      schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
      detail,
      status: String(status),
    },
    status
  );
}

export async function authenticateScimRequest(
  req: NextRequest
): Promise<{ workspaceId: string } | null> {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;

  const hash = hashBearerToken(token);
  const workspace = await prisma.workspace.findFirst({
    where: { scimEnabled: true, scimTokenHash: hash, isPersonal: false },
    select: { id: true },
  });
  if (!workspace) return null;
  return { workspaceId: workspace.id };
}

export function generateScimBearerToken(): { token: string; hash: string; prefix: string } {
  const raw = crypto.randomBytes(32).toString('hex');
  const token = `qrb_scim_${raw}`;
  return {
    token,
    hash: hashBearerToken(token),
    prefix: token.slice(0, 16),
  };
}

type MemberRow = {
  id: string;
  email: string;
  role: string;
  status: string;
  joinedAt: Date | null;
  user?: { name: string | null } | null;
};

export function memberToScimUser(member: MemberRow) {
  const active = member.status === 'active';
  const displayName = member.user?.name ?? member.email.split('@')[0];
  return {
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
    id: member.id,
    userName: member.email,
    name: { formatted: displayName },
    displayName,
    active,
    emails: [{ value: member.email, primary: true }],
    meta: {
      resourceType: 'User',
      created: member.joinedAt?.toISOString() ?? undefined,
    },
    'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
      role: member.role,
    },
  };
}

export function parseScimRole(body: Record<string, unknown>): string | null {
  const ext = body['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'];
  if (ext && typeof ext === 'object' && ext !== null && 'role' in ext) {
    const role = String((ext as { role?: unknown }).role ?? '').toLowerCase();
    if (['admin', 'editor', 'viewer'].includes(role)) return role;
  }
  const groups = body.groups;
  if (Array.isArray(groups) && groups.length) {
    const g0 = groups[0];
    if (typeof g0 === 'object' && g0 !== null && 'value' in g0) {
      const role = String((g0 as { value?: unknown }).value ?? '').toLowerCase();
      if (['admin', 'editor', 'viewer'].includes(role)) return role;
    }
  }
  return null;
}

export function parseScimPatchActive(ops: unknown): boolean | null {
  if (!Array.isArray(ops)) return null;
  for (const op of ops) {
    if (!op || typeof op !== 'object') continue;
    const patch = op as { op?: string; path?: string; value?: unknown };
    const path = (patch.path ?? '').toLowerCase();
    if (patch.op === 'replace' && (path === 'active' || path === '')) {
      if (typeof patch.value === 'boolean') return patch.value;
      if (patch.value && typeof patch.value === 'object' && 'active' in patch.value) {
        return Boolean((patch.value as { active?: unknown }).active);
      }
    }
  }
  return null;
}

export const SERVICE_PROVIDER_CONFIG = {
  schemas: ['urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig'],
  documentationUri: 'https://qrbanner.com/enterprise',
  patch: { supported: true },
  bulk: { supported: false, maxOperations: 0, maxPayloadSize: 0 },
  filter: { supported: true, maxResults: 100 },
  changePassword: { supported: false },
  sort: { supported: false },
  etag: { supported: false },
  authenticationSchemes: [
    {
      type: 'oauthbearertoken',
      name: 'OAuth Bearer Token',
      description: 'Workspace SCIM bearer token',
      specUri: 'https://tools.ietf.org/html/rfc6750',
      primary: true,
    },
  ],
};

export const SCIM_SCHEMAS = {
  schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
  totalResults: 2,
  Resources: [
    {
      id: 'urn:ietf:params:scim:schemas:core:2.0:User',
      name: 'User',
      description: 'Workspace member',
      attributes: [],
    },
    {
      id: 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User',
      name: 'Enterprise User',
      description: 'Role extension',
      attributes: [],
    },
  ],
};
