import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { hashBearerToken } from '@/lib/secret-crypto';

export const SCIM_CONTENT_TYPE = 'application/scim+json';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  'https://qrbanner.com'
).replace(/\/$/, '');

export const SCIM_ROLE_GROUPS = ['admin', 'editor', 'viewer'] as const;
export type ScimRoleGroupId = (typeof SCIM_ROLE_GROUPS)[number];

export function isScimRoleGroupId(id: string): id is ScimRoleGroupId {
  return (SCIM_ROLE_GROUPS as readonly string[]).includes(id);
}

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

function normalizeRoleValue(raw: string): ScimRoleGroupId | null {
  const v = raw.trim().toLowerCase();
  const fromPath = v.match(/(?:^|\/)(admin|editor|viewer)\/?$/);
  const role = fromPath?.[1] ?? v;
  return isScimRoleGroupId(role) ? role : null;
}

export function memberToScimUser(member: MemberRow) {
  const active = member.status === 'active';
  const displayName = member.user?.name ?? member.email.split('@')[0];
  const roleGroup = isScimRoleGroupId(member.role) ? member.role : null;
  return {
    schemas: [
      'urn:ietf:params:scim:schemas:core:2.0:User',
      'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User',
    ],
    id: member.id,
    userName: member.email,
    name: { formatted: displayName },
    displayName,
    active,
    emails: [{ value: member.email, primary: true }],
    groups: roleGroup
      ? [
          {
            value: roleGroup,
            display: roleGroup,
            $ref: `${SITE_URL}/api/scim/v2/Groups/${roleGroup}`,
          },
        ]
      : [],
    meta: {
      resourceType: 'User',
      created: member.joinedAt?.toISOString() ?? undefined,
      location: `${SITE_URL}/api/scim/v2/Users/${member.id}`,
    },
    'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
      role: member.role,
    },
  };
}

export function roleGroupToScim(
  id: ScimRoleGroupId,
  members: Array<{ id: string; email: string }>
) {
  return {
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:Group'],
    id,
    displayName: id,
    members: members.map((m) => ({
      value: m.id,
      display: m.email,
      $ref: `${SITE_URL}/api/scim/v2/Users/${m.id}`,
    })),
    meta: {
      resourceType: 'Group',
      location: `${SITE_URL}/api/scim/v2/Groups/${id}`,
    },
  };
}

export function parseScimRole(body: Record<string, unknown>): string | null {
  const ext = body['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'];
  if (ext && typeof ext === 'object' && ext !== null && 'role' in ext) {
    const role = normalizeRoleValue(String((ext as { role?: unknown }).role ?? ''));
    if (role) return role;
  }
  const groups = body.groups;
  if (Array.isArray(groups) && groups.length) {
    const g0 = groups[0];
    if (typeof g0 === 'object' && g0 !== null && 'value' in g0) {
      const role = normalizeRoleValue(String((g0 as { value?: unknown }).value ?? ''));
      if (role) return role;
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

function collectMemberIds(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) {
    const ids: string[] = [];
    for (const item of value) {
      if (typeof item === 'string') ids.push(item);
      else if (item && typeof item === 'object' && 'value' in item) {
        const v = String((item as { value?: unknown }).value ?? '').trim();
        if (v) ids.push(v);
      }
    }
    return ids;
  }
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return collectMemberIds((value as { value?: unknown }).value);
  }
  return [];
}

/** Parse SCIM Group PATCH ops for membership changes. */
export function parseScimGroupMemberOps(ops: unknown): {
  add: string[];
  remove: string[];
  replace: string[] | null;
} {
  const add: string[] = [];
  const remove: string[] = [];
  let replace: string[] | null = null;
  if (!Array.isArray(ops)) return { add, remove, replace };

  for (const op of ops) {
    if (!op || typeof op !== 'object') continue;
    const patch = op as { op?: string; path?: string; value?: unknown };
    const opName = String(patch.op ?? '').toLowerCase();
    const path = (patch.path ?? '').toLowerCase();
    const isMembers = path === 'members' || path === '';
    if (!isMembers && !path.startsWith('members')) continue;

    if (opName === 'add') add.push(...collectMemberIds(patch.value));
    else if (opName === 'remove') {
      if (path.startsWith('members[') && path.includes('value eq')) {
        const m = path.match(/value\s+eq\s+"([^"]+)"/i);
        if (m?.[1]) remove.push(m[1]);
      } else {
        remove.push(...collectMemberIds(patch.value));
      }
    } else if (opName === 'replace') {
      replace = collectMemberIds(patch.value);
    }
  }
  return { add, remove, replace };
}

export async function loadRoleGroupMembers(workspaceId: string, role: ScimRoleGroupId) {
  return prisma.workspaceMember.findMany({
    where: { workspaceId, role },
    select: { id: true, email: true },
    orderBy: { invitedAt: 'asc' },
  });
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
  totalResults: 3,
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
    {
      id: 'urn:ietf:params:scim:schemas:core:2.0:Group',
      name: 'Group',
      description: 'Virtual role groups: admin, editor, viewer',
      attributes: [],
    },
  ],
};

export const SCIM_RESOURCE_TYPES = {
  schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
  totalResults: 2,
  Resources: [
    {
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:ResourceType'],
      id: 'User',
      name: 'User',
      endpoint: '/Users',
      description: 'Workspace members',
      schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
      schemaExtensions: [
        {
          schema: 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User',
          required: false,
        },
      ],
      meta: { resourceType: 'ResourceType', location: `${SITE_URL}/api/scim/v2/ResourceTypes/User` },
    },
    {
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:ResourceType'],
      id: 'Group',
      name: 'Group',
      endpoint: '/Groups',
      description: 'Virtual role groups (admin, editor, viewer)',
      schema: 'urn:ietf:params:scim:schemas:core:2.0:Group',
      meta: { resourceType: 'ResourceType', location: `${SITE_URL}/api/scim/v2/ResourceTypes/Group` },
    },
  ],
};
